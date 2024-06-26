const bcrypt = require("bcrypt");
const { randomBytes } = require("node:crypto");
const web3 = require("../web3-Instance");
const UserStorage = require("../user-storage");
const { generateToken } = require("../middlewares/jwt/jwt");

exports.getNonce = async (req, res) => {
  const nonce = randomBytes(32).toString("hex");

  res.json({ nonce });
};

exports.signup = async (req, res) => {
  try {
    const { signature, username, password, address, nonce } = req.body;
    console.log("sign up username", username);
    console.log("sign up password", password);
    console.log("sign up address", address);
    console.log("sign up signature", signature);

    if (!web3.utils.toChecksumAddress(address)) {
      return res.status(400).send("Invalid address");
    }

    // Check if the username is already taken
    const isUsernameTaken = await UserStorage.methods.isUsernameTaken(username).call();
    if (isUsernameTaken) {
      return res.status(400).send("Username already taken");
    }

    // Check if user is already registered
    const isRegistered = await UserStorage.methods.isRegistered(address).call();
    if (isRegistered) {
      return res.status(400).send("User already exists");
    }

    // Recover the address from the signature
    const recoveredAddress = web3.eth.accounts.recover(nonce, signature);
    console.log("Recovered Address", recoveredAddress);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).send("Invalid signature");
    }

    const hash1 = web3.utils.sha3(username);
    console.log("sign up hash1", hash1);
    const hash2 = bcrypt.hashSync(password, process.env.STATIC_SALT);
    console.log("sign up hash2", hash2);
    const finalHash = web3.utils.sha3(hash1 + hash2);
    console.log("Sign up Final Hash", finalHash);

    const accounts = await web3.eth.getAccounts();
    await UserStorage.methods.storeUser(address, finalHash, username).send({
      from: accounts[0],
    });

    res.status(200).send("User registered successfully");
  } catch (error) {
    console.log(error);
    if (error.message.includes("Username already taken")) {
      return res.status(400).send("Username already taken");
    }
    if (error.message.includes("User already exists")) {
      return res.status(400).send("User already exists");
    }
    res.status(500).send("Error registering user");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, address, signature, nonce } = req.body;

    // Recover the address from the signature
    const recoveredAddress = web3.eth.accounts.recover(nonce, signature);
    console.log("Recovered Address", recoveredAddress);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).send("Invalid signature");
    }

    // Check if the user is registered
    const isRegistered = await UserStorage.methods.isRegistered(address).call();
    if (!isRegistered) {
      return res.status(404).send("User not found");
    }

    // Fetch stored user data
    const storedUser = await UserStorage.methods.getUser(address).call();
    const storedHash = storedUser.userHash;

    if (!storedHash) {
      return res.status(404).send("User not found");
    }

    const hash1 = web3.utils.sha3(username);
    console.log("log in hash1", hash1);
    const hash2 = bcrypt.hashSync(password, process.env.STATIC_SALT);
    console.log("log in hash2", hash2);
    const finalHash = web3.utils.sha3(hash1 + hash2);
    console.log("log in Final Hash", finalHash);

    if (finalHash === storedHash) {
      const token = generateToken({ username, address });
      res.status(200).send({ message: "User logged in successfully", token });
    } else {
      res.status(400).send({ message: "Invalid credentials, Please try again.." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, image, addressInfo, number } = req.body;
    const { address } = req.user;

    if (!web3.utils.toChecksumAddress(address)) {
      return res.status(400).send("Invalid address");
    }

    const storedUser = await UserStorage.methods.getUser(address).call();
    if (!storedUser.userHash) {
      return res.status(404).send("User not found");
    }

    const accounts = await web3.eth.getAccounts();
    await UserStorage.methods.updateUser(address, firstName, lastName, image, addressInfo, number).send({
      from: accounts[0],
    });

    res.status(200).send("User information updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user information");
  }
};

exports.loginWithMetamask = async (req, res) => {
  try {
    const { address, signature, nonce } = req.body;

    if (!web3.utils.toChecksumAddress(address)) {
      return res.status(400).send("Invalid address");
    }

    const storedUser = await UserStorage.methods.getUser(address).call();
    if (!storedUser.userHash) {
      return res.status(404).send("User not found");
    }

    const recoveredAddress = web3.eth.accounts.recover(nonce, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).send("Invalid signature");
    }

    const token = generateToken({ address });
    res.status(200).send({ message: "User logged in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { address } = req.user;

    if (!web3.utils.toChecksumAddress(address)) {
      return res.status(400).send("Invalid address");
    }

    const storedUser = await UserStorage.methods.getUser(address).call();
    if (!storedUser.userHash) {
      return res.status(404).send("User not found");
    }

    const { firstName, lastName, image, addressInfo, number } = storedUser;

    res.status(200).send({
      address,
      firstName,
      lastName,
      image,
      addressInfo,
      number,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user information");
  }
};

exports.authenticate = async (req, res) => {
  res.status(200).send({ message: "Authenticated", user: req.user });
};
