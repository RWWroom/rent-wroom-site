exports.handler = async (event) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return { statusCode: 500, body: "Missing env vars (GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET)." };
  }

  const code = event.queryStringParameters?.code;
  if (!code) {
    return { statusCode: 400, body: "Missing ?code from GitHub callback." };
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  });

  const tokenJson = await tokenRes.json();

  if (!tokenRes.ok || !tokenJson.access_token) {
    return { statusCode: 500, body: `Token exchange failed: ${JSON.stringify(tokenJson)}` };
  }

  const access_token = tokenJson.access_token;
  const redirectTo = `/admin/#access_token=${encodeURIComponent(access_token)}&token_type=bearer`;

  return {
    statusCode: 302,
    headers: { Location: redirectTo },
    body: "",
  };
};
