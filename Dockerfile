# Base image for Odoo
FROM odoo:16 AS odoo

# Base image for Node.js applications
FROM node:16 AS node-base

# Install dependencies and build backend (Nest.js)
FROM node-base AS backend
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Install dependencies and build frontend (Next.js)
FROM node-base AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Base image for Python applications
FROM python:3.10 AS python-base

# Install dependencies for ranking_engine (FastAPI)
FROM python-base AS ranking_engine
WORKDIR /ranking_engine
COPY ranking_engine/requirements.txt .
RUN pip install -r requirements.txt
COPY ranking_engine/ ./

# Final stage
FROM ubuntu:20.04

# Install necessary packages
RUN apt-get update && apt-get install -y \
    supervisor \
    mysql-server \
    postgresql postgresql-contrib \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure MySQL
RUN mkdir -p /var/run/mysqld && chown -R mysql:mysql /var/run/mysqld
RUN sed -i 's/^bind-address/#bind-address/' /etc/mysql/mysql.conf.d/mysqld.cnf
RUN sed -i 's/^password/#password/' /etc/mysql/mysql.conf.d/mysqld.cnf
RUN echo "skip-grant-tables" >> /etc/mysql/mysql.conf.d/mysqld.cnf
RUN echo "[mysqld]\nskip-grant-tables" >> /etc/mysql/mysql.conf.d/mysqld.cnf

# Configure PostgreSQL
RUN service postgresql start && \
    sudo -u postgres psql -c "CREATE USER \"donia2004436@miuegypt.edu.eg\" WITH PASSWORD 'admin';" && \
    sudo -u postgres psql -c "CREATE DATABASE \"odoo-resufit\";" && \
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"odoo-resufit\" TO \"donia2004436@miuegypt.edu.eg\";"

# Copy Odoo from the build stage
COPY --from=odoo /usr/bin/odoo /usr/bin/odoo
COPY --from=odoo /var/lib/odoo /var/lib/odoo
COPY --from=odoo /etc/odoo /etc/odoo

# Copy backend from the build stage
COPY --from=backend /backend /backend

# Copy frontend from the build stage
COPY --from=frontend /frontend /frontend

# Copy ranking_engine from the build stage
COPY --from=ranking_engine /ranking_engine /ranking_engine

# Copy supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose necessary ports
EXPOSE 8069 3001 3002 8000 3306

# Command to start supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
