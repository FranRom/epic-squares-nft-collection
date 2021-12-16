// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

// We need some util functions for strings.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We need to import the helper functions from the contract that we copy/pasted.
import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string svgPartOne =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo =
        "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = [
        "Aback",
        "Abandoned",
        "Abashed",
        "Aberrant",
        "Abnormal",
        "Aboriginal",
        "Abortive",
        "Abrasive",
        "Abrupt",
        "Absent",
        "Absorbed",
        "Absorbing",
        "Abstracted",
        "Absurd",
        "Abundant",
        "Abusive",
        "Acceptable",
        "Accessible",
        "Accidental",
        "Accurate",
        "Acid",
        "Acidic",
        "Acoustic",
        "Acrid",
        "Adamant",
        "Adaptable"
    ];
    string[] secondWords = [
        "Bruscetta",
        "Bacon",
        "Bean",
        "Bagel",
        "Baked",
        "Bison",
        "Barley",
        "Beer",
        "Fish",
        "Bread",
        "Broccoli",
        "Buritto",
        "Babaganoosh",
        "Cabbage",
        "Cake",
        "Carrot",
        "Celer"
        "Cheese",
        "Chicken",
        "Catfish",
        "Chips",
        "Chocolate",
        "Chowder",
        "Clam",
        "Coffee"
        "Cookies",
        "Corn",
        "Cupcakes",
        "Crab",
        "Curry"
    ];
    string[] thirdWords = [
        "Aletta",
        "Anju",
        "Aoba",
        "Asuka",
        "Ayano",
        "Balalaika",
        "Boa",
        "Choouko",
        "Chiyo",
        "Daisuke",
        "Emi",
        "Ennis",
        "Fumiko",
        "Gaara",
        "Gypsy",
        "Hana",
        "Hannya",
        "Hideko",
        "Isamu",
        "Junichi",
        "Kamiko",
        "Kanon",
        "Kokoro",
        "Lina",
        "Lucy"
    ];

    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("This is my NFT contract. Woah!");
    }

    function pickRandomFirstWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId)))
        );
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId)))
        );
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId)))
        );
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function pickRandomColor(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("COLOR", Strings.toString(tokenId)))
        );
        rand = rand % colors.length;
        return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256) {
        return _tokenIds.current();
    }

    function makeAnEpicNFT() public {
        require(
            _tokenIds.current() < 1000,
            "The max number of NFTs have been minted"
        );
        uint256 newItemId = _tokenIds.current();

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(
            abi.encodePacked(first, second, third)
        );

        string memory randomColor = pickRandomColor(newItemId);

        string memory finalSvg = string(
            abi.encodePacked(
                svgPartOne,
                randomColor,
                svgPartTwo,
                combinedWord,
                "</text></svg>"
            )
        );

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        // Update your URI!!!
        _setTokenURI(newItemId, finalTokenUri);

        _tokenIds.increment();
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
