# Phase 1 libraries
import os
os.environ["GROQ_API_KEY"] = "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"

import warnings
import logging

import streamlit as st

# Phase 2 libraries
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Phase 3 libraries
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA

# Disable warnings and info logs
warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)

st.title('Ask Chatbot!')

# Upload a PDF file
uploaded_file = st.file_uploader("Upload your PDF", type="pdf")

# Session state to keep track of messages
if 'messages' not in st.session_state:
    st.session_state.messages = []

# Show chat history
for message in st.session_state.messages:
    st.chat_message(message['role']).markdown(message['content'])

# Load and process uploaded PDF into vectorstore
@st.cache_resource(show_spinner="Indexing your PDF...")
def get_vectorstore_from_file(file_path):
    loaders = [PyPDFLoader(file_path)]
    index = VectorstoreIndexCreator(
        embedding=HuggingFaceEmbeddings(model_name='all-MiniLM-L12-v2'),
        text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    ).from_loaders(loaders)
    return index.vectorstore

# Input box for the user prompt
prompt = st.chat_input("Ask your question...")

# Main logic
if prompt and uploaded_file:
    # Save uploaded file temporarily
    with open("temp_uploaded.pdf", "wb") as f:
        f.write(uploaded_file.read())

    # Show user message
    st.chat_message('user').markdown(prompt)
    st.session_state.messages.append({'role': 'user', 'content': prompt})

    try:
        # Set up Groq model
        model = "llama3-8b-8192"
        groq_chat = ChatGroq(
            groq_api_key=os.environ.get("GROQ_API_KEY"),
            model_name=model
        )

        # System prompt template
        groq_sys_prompt = ChatPromptTemplate.from_template("""
        You are very smart at everything, you always give the best, 
        the most accurate and most precise answers. Answer the following Question: {user_prompt}.
        Start the answer directly. No small talk please.
        """)

        # Build vectorstore
        vectorstore = get_vectorstore_from_file("temp_uploaded.pdf")
        retriever = vectorstore.as_retriever(search_kwargs={'k': 3})

        # Create QA chain
        chain = RetrievalQA.from_chain_type(
            llm=groq_chat,
            chain_type='stuff',
            retriever=retriever,
            return_source_documents=True
        )

        # Get response
        result = chain({"query": prompt})
        response = result["result"]

        # Display assistant message
        st.chat_message('assistant').markdown(response)
        st.session_state.messages.append({'role': 'assistant', 'content': response})

    except Exception as e:
        st.error(f"Error: {str(e)}")

elif prompt and not uploaded_file:
    st.warning("Please upload a PDF file before asking a question.")
