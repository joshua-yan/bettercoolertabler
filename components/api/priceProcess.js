import axios from "axios";

const SPOON_KEY = "165f6350c7474b21b325d532a40c0980";
const SPOON_URL = "https://api.spoonacular.com/food/";

async function findFirstEntryWithPrice(ingredient) {
    let numProducts = ingredient["products"].length;
    let lastPrice = 0;
    let index = 0;
    let lastResponse = undefined;
    while (lastPrice === 0 && index < numProducts && index < 5) {
        let response = await axios.get(SPOON_URL + "products/" + ingredient["products"][index]["id"]
            + "?apiKey=" + SPOON_KEY);

        lastResponse = response;

        lastPrice = response.data["price"];

        index++;
    }

    if (lastResponse) {
        console.log(lastResponse.data);

        return lastResponse.data;
    } else {
        return Promise.resolve(undefined);
    }
}

async function priceProcess(ingredientList) {
    let ingredientNames = ingredientList.map(ingredient => ingredient.getName());

    let idResponse = (await axios.post(SPOON_URL + "ingredients/map?apiKey=" + SPOON_KEY, {
        "ingredients": ingredientNames,
        "servings": 1
    })).data;

    let idRequests = [];
    for (let ingredient of idResponse) {
        idRequests.push(
            findFirstEntryWithPrice(ingredient)
        );
    }

    let responses = await Promise.all(idRequests);

    return ingredientList.map((ingredient, index) => {
        if (responses[index]) {
            ingredient.setPrice(responses[index]["price"]);
            ingredient.setProductName(responses[index]["title"]);
            return ingredient;
        }
    });
}

export default priceProcess;