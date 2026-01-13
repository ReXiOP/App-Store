<?php
/**
 * SM40 OAuth Landing & Handler
 * Shows a landing page by default, handles OAuth when code is present
 */

// --- CONFIGURATION ---
$app_id     = '38bfceb39ace523e565b';
$app_secret = 'dd97893f1ab0226c73892a4f3fafe15171171cd';
$base_url   = 'https://sm40.com';
$nextjs_app = 'http://localhost:3000'; // Change this to your Next.js app URL

// Helper function for API calls
function makeApiCall($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); 
    $output = curl_exec($ch);
    if (curl_errno($ch)) {
        return json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    }
    curl_close($ch);
    return $output;
}

// --- OAUTH FLOW: Only if we have a code ---
if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    // Exchange code for token
    $token_url = "{$base_url}/authorize?app_id={$app_id}&app_secret={$app_secret}&code={$code}";
    $response  = makeApiCall($token_url);
    $json      = json_decode($response, true);

    if (empty($json['access_token'])) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Failed to get access token', 'debug' => $json]);
        exit;
    }

    // Get user data
    $api_url = "{$base_url}/app_api?access_token={$json['access_token']}&type=get_user_data";
    $user_json = json_decode(makeApiCall($api_url), true);
    
    $user = $user_json['user_data'] ?? $user_json['data']['user_data'] ?? null;

    if (empty($user)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Failed to get user data', 'debug' => $user_json]);
        exit;
    }

    // Redirect to Next.js with user payload
    $user_payload = base64_encode(json_encode([
        'id' => $user['username'],
        'name' => $user['name'],
        'email' => $user['email'],
        'image' => $user['avatar'],
        'provider' => 'sm40'
    ]));
    header("Location: {$nextjs_app}/api/auth/sm40-callback?token={$user_payload}");
    exit;
}

// --- START AUTH: Only when explicitly requested ---
if (isset($_GET['action']) && $_GET['action'] === 'login') {
    header("Location: {$base_url}/oauth?app_id={$app_id}");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth SM40 - Authentication Service</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            max-width: 500px;
            padding: 40px;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 32px;
            font-weight: bold;
            backdrop-filter: blur(10px);
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            font-weight: 800;
        }
        p {
            opacity: 0.9;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            padding: 15px 40px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .footer {
            margin-top: 50px;
            opacity: 0.7;
            font-size: 0.85rem;
        }
        .footer a { color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">40</div>
        <h1>OAuth SM40</h1>
        <p>Secure authentication gateway for SM40 community integration. Connect your SM40 account to partner applications seamlessly.</p>
        <a href="?action=login" class="btn">Connect with SM40</a>
        <div class="footer">
            Powered by <a href="https://sm40.com" target="_blank">SM40.com</a>
        </div>
    </div>
</body>
</html>
