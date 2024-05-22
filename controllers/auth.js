const bcrypt = require("bcrypt");
const web3 = require("../web3-Instance");
const UserStorage = require("../user-storage");
const { generateToken } = require("../middlewares/jwt/jwt");

exports.signup = async (req, res) => {
  try {
    const { signature, username, password, address } = req.body;
    console.log("sign up username", username);
    console.log("sign up password", password);
    console.log("sign up address", address);
    console.log("sign up signature", signature);

    if (!web3.utils.toChecksumAddress(address)) {
      return res.status(400).send("Invalid address");
    }

    // Recover the address from the signature
    const recoveredAddress = web3.eth.accounts.recover(username, signature);
    console.log("Recovered Address", recoveredAddress);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).send("Invalid signature");
    }

    const hash1 = web3.utils.sha3(signature);
    console.log("sign up hash1", hash1);
    const hash2 = bcrypt.hashSync(password, process.env.STATIC_SALT);
    console.log("sign up hash2", hash2);
    const finalHash = web3.utils.sha3(hash1 + hash2);
    console.log("Sign up Final Hash", finalHash);

    const accounts = await web3.eth.getAccounts();
    // console.log("accounts", accounts);
    await UserStorage.methods.storeUserHash(address, finalHash).send({
      from: accounts[0],
      gas: 150000,
      gasPrice: "30000000000",
    });

    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, address, signature } = req.body;

    const storedHash = await UserStorage.methods.getUserHash(address).call();
    console.log("storedHash", storedHash);
    if (!storedHash) {
      return res.status(404).send("User not found");
    }

    const hash1 = web3.utils.sha3(signature);
    console.log("log in hash1", hash1);
    const hash2 = bcrypt.hashSync(password, process.env.STATIC_SALT);
    console.log("log in hash2", hash2);
    const finalHash = web3.utils.sha3(hash1 + hash2);
    console.log("log in Final Hash", finalHash);

    if (finalHash === storedHash) {
      const token = generateToken({ username, address });
      res.status(200).send({ message: "User logged in successfully", token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
};
