"""
URL feature extraction for phishing detection.
Produces a numeric feature vector compatible with typical phishing ML pipelines.
"""
import re
import numpy as np
from urllib.parse import urlparse


def extract_url_features(url: str) -> np.ndarray:
    """
    Extract a fixed-size feature vector from a URL.
    Features are commonly used in phishing detection literature.
    """
    if not url or not isinstance(url, str):
        url = ""
    url = url.strip().lower()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        parsed = urlparse(url)
        domain = parsed.netloc or ""
        path = parsed.path or ""
        query = parsed.query or ""
        full = url
    except Exception:
        domain, path, query, full = "", "", "", url

    # Length features
    features = [
        len(full),
        len(domain),
        len(path),
        len(query),
    ]
    # Count-based
    features.append(full.count("."))
    features.append(full.count("-"))
    features.append(full.count("_"))
    features.append(full.count("/"))
    features.append(full.count("?"))
    features.append(full.count("="))
    features.append(full.count("@"))
    features.append(full.count("&"))
    features.append(full.count("%"))
    features.append(full.count("!"))
    features.append(full.count("#"))
    # Digit ratio
    features.append(sum(c.isdigit() for c in full) / max(len(full), 1))
    # Letter ratio
    features.append(sum(c.isalpha() for c in full) / max(len(full), 1))
    # Special char ratio
    features.append(sum(not (c.isalnum() or c in ".-_/?:=&%@") for c in full) / max(len(full), 1))
    # Has IP (simple check)
    features.append(1.0 if re.search(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", domain) else 0.0)
    # Subdomain count
    features.append(max(0, domain.count(".") - 1))
    # HTTPS
    features.append(1.0 if full.startswith("https") else 0.0)
    # Num digits in domain
    features.append(sum(c.isdigit() for c in domain))
    # Domain length / path length ratio
    features.append(len(domain) / max(len(path), 1))
    # Suspicious keywords (common in phishing)
    suspicious = ["login", "signin", "account", "verify", "secure", "bank", "paypal", "update"]
    features.append(sum(1 for w in suspicious if w in full))
    # Number of hyphens in domain
    features.append(domain.count("-"))
    # Longest token in path
    tokens = path.split("/")
    features.append(max((len(t) for t in tokens), default=0))
    # Total number of tokens
    features.append(len([t for t in tokens if t]))

    arr = np.array(features, dtype=np.float64).reshape(1, -1)
    # Ensure fixed size (pad or trim to 30 features for compatibility)
    n = 30
    if arr.shape[1] < n:
        arr = np.hstack([arr, np.zeros((1, n - arr.shape[1]))])
    else:
        arr = arr[:, :n]
    return arr
