exports.handler = async () => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const callback = process.env.OAUTH_CALLBACK_URL;

  if (!client_id || !callback) {
    return { statusCode: 500, body: "Missing env vars (GITHUB_CLIENT_ID or OAUTH_CALLBACK_URL)." };
  }

  const scope = "repo";
  const authUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(client_id)}` +
    `&redirect_uri=${encodeURIComponent(callback)}` +
    `&scope=${encodeURIComponent(scope)}`;

  return {
    statusCode: 302,
    headers: { Location: authUrl },
    body: "",
  };
};
