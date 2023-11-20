# Use a base image with Python and MongoDB pre-installed
FROM python:3.9
# Copy the Python requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade firebase-admin
RUN pip install Flask[async]
RUN pip install kubernetes
# Copy the Python script
# COPY booking/main.py .
# COPY booking/serviceAccountKey.json .
# COPY booking/login.html .
# COPY booking/css/login.css .
WORKDIR /app
COPY booking /app/booking
# Set the working directory

# Start the Python application
# Set environment variable
CMD ["python", "booking/app.py"]
