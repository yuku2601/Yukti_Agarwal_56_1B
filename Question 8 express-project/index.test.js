const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./app");

test("GET routes render their corresponding pages", async (t) => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => server.close());

  const address = server.address();
  const pages = [
    ["/", "Home Page"],
    ["/about", "About Page"],
    ["/services", "Services Page"],
    ["/contact", "Contact Page"],
    ["/login", "Login"],
  ];

  for (const [path, content] of pages) {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(content));
  }
});

test("POST /login displays the submitted username safely", async (t) => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: "<script>alert(1)</script>" }),
  });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Welcome &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
});
