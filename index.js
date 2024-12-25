console.log(process.env.WEBHOOK_URL);

fetch(process.env.WEBHOOK_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        content: "This test message was automatically deployed to the vps!!!",
    }),
}).then((response) => {
    console.log(response.status);
});

console.log("DONE");
