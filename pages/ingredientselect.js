import React from 'react';
import {withRouter} from 'next/router';
import cookies from "js-cookie";

import Ingredient from "../models/Ingredient";
import IngredientCollection from "../models/IngredientCollection";

import IngredientSelection from "../components/IngredientSelection";


const IngredientSelectPage = withRouter(props => {
    console.log(props);
    return (
        <IngredientSelection ingredientCollection={
            new IngredientCollection(props.ingredients.map(raw => Ingredient.fromRawObject(raw)))} />
    )
});

IngredientSelectPage.getInitialProps = function(context) {
    const {ingredients} = context.query;

    let props = { ingredients: JSON.parse(decodeURIComponent(ingredients)) };
    console.log(props);
    return props;
};

export default IngredientSelectPage;