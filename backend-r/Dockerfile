FROM rocker/r-ver:4.4.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    libcurl4-openssl-dev libssl-dev libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN Rscript -e "install.packages(c('plumber', 'jsonlite', 'dplyr', 'lubridate'), repos='https://cran.r-project.org')"

WORKDIR /app
COPY . .

EXPOSE 8002
CMD ["Rscript", "run.R"]
