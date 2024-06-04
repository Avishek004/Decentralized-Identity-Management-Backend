// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserStorage {
    struct User {
        bytes32 userHash;
        bytes32 userInfoHash;
    }

    mapping(address => User) private users;
    mapping(address => bool) private registered;

    function storeUser(
        address user,
        bytes32 userHash
    ) public {
        require(!registered[user], "User already exists");
        users[user].userHash = userHash; // Store userInfoHash
        registered[user] = true;
    }

    function updateUser(
        address user,
        bytes32 userInfoHash // Update with userInfoHash only
    ) public {
        require(registered[user], "User does not exist");
        users[user].userInfoHash = userInfoHash; // Update userInfoHash
    }

    function getUser(address user) public view returns (User memory) {
        require(registered[user], "User does not exist");
        return users[user];
    }

    function isRegistered(address user) public view returns (bool) {
        return registered[user];
    }
}
