FROM python:3.11-slim

WORKDIR /app

# Install system dependencies yang diperlukan Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxtst6 \
    libxss1 \
    libxt6 \
    fonts-liberation \
    libasound2 \
    libappindicator3-1 \
    libxcursor1 \
    libxinerama1 \
    libxi6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN python -m playwright install chromium

# Copy aplikasi
COPY . .

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["python", "main.py"]
