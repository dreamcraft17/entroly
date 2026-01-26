#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -euo pipefail

# --- CONFIGURATION ---
# Set your old and new base domains here.
# OLD_DOMAIN="mals.dev"
# NEW_DOMAIN="mals.dev"

OLD_DOMAIN="entro.ly"
NEW_DOMAIN="entro.ly"

# Set your Certbot registration email here.
CERTBOT_EMAIL="malik@entropimartech.com"
# CERTBOT_EMAIL="malikbaharsyah@gmail.com"

# Map your subdomains (including prefixes like 'api.') to their local backend ports.
# This is the most important part to configure correctly.
declare -A SUBDOMAIN_PORTS
SUBDOMAIN_PORTS=(
    # ["booking"]="5052"
    # ["api.booking"]="4008"
    # ["greensync"]="5054"
    # ["api.greensync"]="4010"
    # ["survival-shooter"]="5055"
    # ["undian"]="3000"
    # ["chat-mjs"]="5053"
    # ["api.chat-mjs"]="4009"
    # ["api.dotnetundian"]="4011"
    # ["dotnetundian"]="5056"
    # ["grafana"]="3005"
    # ["linkhub"]="4012"
    # ["linkhub"]="4013"
    # ["@"]="4013"
    ["rank"]="4014"
)
# --- END CONFIGURATION ---

# --- SCRIPT ---

# 1. Check for root privileges
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (or with sudo)."
   exit 1
fi

# 2. Display plan and ask for confirmation
echo "⚠️  This script will perform the following actions:"
echo "--------------------------------------------------"
echo "  - OLD DOMAIN: ${OLD_DOMAIN}"
echo "  - NEW DOMAIN: ${NEW_DOMAIN}"
echo ""
echo "For each subdomain in the list:"
for SUB in "${!SUBDOMAIN_PORTS[@]}"; do
    # Handle root domain display (@ symbol)
    if [ "${SUB}" = "@" ]; then
        DISPLAY_OLD="${OLD_DOMAIN}"
        DISPLAY_NEW="${NEW_DOMAIN}"
    else
        DISPLAY_OLD="${SUB}.${OLD_DOMAIN}"
        DISPLAY_NEW="${SUB}.${NEW_DOMAIN}"
    fi
    echo "  - Will DELETE Certbot certificate for: ${DISPLAY_OLD}"
    echo "  - Will DELETE Nginx configs for:      ${DISPLAY_OLD}"
    echo "  - Will CREATE Nginx config for:      ${DISPLAY_NEW} (proxies to port ${SUBDOMAIN_PORTS[$SUB]})"
    echo "  - Will OBTAIN a new certificate for:   ${DISPLAY_NEW}"
done
echo "--------------------------------------------------"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
fi

# 3. Cleanup old domain configurations and certificates
echo "🧹 Starting cleanup of old domain: ${OLD_DOMAIN}..."
for SUB in "${!SUBDOMAIN_PORTS[@]}"; do
    # Handle root domain (@ symbol)
    if [ "${SUB}" = "@" ]; then
        OLD_FULL_DOMAIN="${OLD_DOMAIN}"
    else
        OLD_FULL_DOMAIN="${SUB}.${OLD_DOMAIN}"
    fi

    echo "--- Processing ${OLD_FULL_DOMAIN} ---"

    # Remove Certbot certificate if it exists
    echo "Searching for certificate: ${OLD_FULL_DOMAIN}"
    if certbot certificates | grep -q "Certificate Name: ${OLD_FULL_DOMAIN}"; then
        echo "   Deleting certificate for ${OLD_FULL_DOMAIN}..."
        certbot delete --cert-name "${OLD_FULL_DOMAIN}"
    else
        echo "   Certificate not found. Skipping deletion."
    fi

    # Remove Nginx configuration files
    echo "   Deleting Nginx configs for ${OLD_FULL_DOMAIN}..."
    rm -f "/etc/nginx/sites-available/${OLD_FULL_DOMAIN}"
    rm -f "/etc/nginx/sites-enabled/${OLD_FULL_DOMAIN}"
done

# 4. Create and enable new HTTP-only Nginx configs
echo "🚀 Creating new HTTP-only configs for new domain: ${NEW_DOMAIN}..."
for SUB in "${!SUBDOMAIN_PORTS[@]}"; do
    # Handle root domain (@ symbol)
    if [ "${SUB}" = "@" ]; then
        NEW_FULL_DOMAIN="${NEW_DOMAIN}"
    else
        NEW_FULL_DOMAIN="${SUB}.${NEW_DOMAIN}"
    fi
    PORT=${SUBDOMAIN_PORTS[$SUB]}
    NGINX_CONF_PATH="/etc/nginx/sites-available/${NEW_FULL_DOMAIN}"

    echo "   Creating config for ${NEW_FULL_DOMAIN} -> http://localhost:${PORT}"

    # Create the server block configuration file using a heredoc
    cat > "${NGINX_CONF_PATH}" <<EOF
server {
    listen 80;
    server_name ${NEW_FULL_DOMAIN};

    # This block is temporary for Certbot's HTTP-01 challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://localhost:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Enable the new site by creating a symlink
    ln -s "${NGINX_CONF_PATH}" "/etc/nginx/sites-enabled/"
done

# 5. Reload Nginx to apply the new HTTP configs
echo "⚙️ Testing and reloading Nginx..."
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed. Please review the error messages."
    exit 1
fi
systemctl reload nginx
echo "   Nginx reloaded successfully with new HTTP sites."

# 6. Run Certbot to secure the new domains
echo "🔒 Securing new domains with Certbot..."
for SUB in "${!SUBDOMAIN_PORTS[@]}"; do
    # Handle root domain (@ symbol)
    if [ "${SUB}" = "@" ]; then
        NEW_FULL_DOMAIN="${NEW_DOMAIN}"
    else
        NEW_FULL_DOMAIN="${SUB}.${NEW_DOMAIN}"
    fi
    echo "--- Obtaining certificate for ${NEW_FULL_DOMAIN} ---"
    certbot --nginx --non-interactive --agree-tos --email "${CERTBOT_EMAIL}" -d "${NEW_FULL_DOMAIN}" --redirect
done

echo "✅ All done! Your new domains should be configured and secured."