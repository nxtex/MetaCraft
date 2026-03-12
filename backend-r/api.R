library(plumber)
library(jsonlite)
library(dplyr)
library(lubridate)

INTERNAL_KEY <- Sys.getenv("INTERNAL_API_KEY")

# ── Auth filter ───────────────────────────────────────────
#* @filter check-internal-key
function(req, res) {
  key <- req$HTTP_X_INTERNAL_KEY
  if (is.null(key) || key != INTERNAL_KEY) {
    res$status <- 403
    return(list(error = "Forbidden"))
  }
  plumber::forward()
}

# ── Health ───────────────────────────────────────────────
#* @get /health
function() list(status = "ok")

# ── Batch analysis ──────────────────────────────────────
#* @post /analyze
#* @param req The request body
function(req) {
  body <- fromJSON(rawToChar(req$postBody), simplifyDataFrame = FALSE)
  files <- body$files

  if (length(files) == 0) {
    return(list(error = "No files provided"))
  }

  # Build dataframe
  df <- data.frame(
    id        = sapply(files, function(f) f$id),
    name      = sapply(files, function(f) f$name),
    mime      = sapply(files, function(f) f$mime),
    size      = as.numeric(sapply(files, function(f) f$size)),
    created_at = as.POSIXct(sapply(files, function(f) f$created_at), format = "%Y-%m-%dT%H:%M:%S"),
    stringsAsFactors = FALSE
  )

  # ── Format distribution
  format_dist <- df %>%
    mutate(ext = toupper(sub(".*/(.*)", "\\1", mime))) %>%
    count(ext, name = "count") %>%
    arrange(desc(count))

  # ── Files per year
  files_by_year <- df %>%
    mutate(year = format(created_at, "%Y")) %>%
    count(year, name = "count") %>%
    arrange(year)

  # ── Size stats
  size_stats <- list(
    total_bytes  = sum(df$size, na.rm = TRUE),
    mean_bytes   = round(mean(df$size, na.rm = TRUE), 0),
    median_bytes = round(median(df$size, na.rm = TRUE), 0),
    max_bytes    = max(df$size, na.rm = TRUE),
    min_bytes    = min(df$size, na.rm = TRUE)
  )

  # ── GPS presence (from metadata field)
  gps_count <- sum(sapply(files, function(f) {
    meta <- f$metadata
    !is.null(meta$exif$GPS) || !is.null(meta$GPSLatitude)
  }))

  list(
    total_files   = nrow(df),
    format_dist   = format_dist,
    files_by_year = files_by_year,
    size_stats    = size_stats,
    gps_count     = gps_count,
    period        = list(
      from = format(min(df$created_at, na.rm = TRUE), "%Y"),
      to   = format(max(df$created_at, na.rm = TRUE), "%Y")
    )
  )
}
