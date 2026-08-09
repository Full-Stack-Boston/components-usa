<?php
// Archive demo: contact form mail is intentionally disabled.
header('Content-Type: text/plain; charset=UTF-8');
http_response_code(503);
echo 'Contact form disabled in this historical archive demo.';
