// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserStorage {
    mapping(address => bytes32) private userHashes;

    function storeUserHash(address user, bytes32 userHash) public {
        userHashes[user] = userHash;
    }

    function getUserHash(address user) public view returns (bytes32) {
        return userHashes[user];
    }
}
