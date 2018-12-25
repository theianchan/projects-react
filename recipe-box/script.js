var starterRecipes = [
  {name: 'Frey Pies', ingredients: ['Freys', 'Pies', 'Try not to think too hard about it'], id: '1461993924423'},
  {name: 'Noodles', ingredients: ['Ramen', 'Garlic', 'Egg'], id: '1461993924425'}
];

var RecipeBox = React.createClass({
  getInitialState: function() {
    return {
      data: []
    }
  },
  componentDidMount: function() {
    var storedRecipes = localStorage._theianchan_recipes;
    if (storedRecipes) {
      this.setState({data: JSON.parse(storedRecipes)});
    } else {
      this.setState({data: starterRecipes});
    }
  },
  componentDidUpdate: function() {
    Foundation.reInit('accordion');
    $('.reveal').foundation();
  },
  updateRecipes: function(newRecipes) {
    this.setState({data: newRecipes});
    localStorage._theianchan_recipes = JSON.stringify(newRecipes);
  },
  submitRecipe: function(recipeObj) {
    var recipes = this.state.data;
    var newRecipes = recipes.concat([recipeObj]);
    this.updateRecipes(newRecipes);
  },
  editRecipe: function(editedRecipe) {
    var recipes = this.state.data;
    var newRecipes = [];
    for (var i in recipes) {
      if (recipes[i].id === editedRecipe.id) {
        newRecipes.push(editedRecipe);
      } else {
        newRecipes.push(recipes[i]);
      }
    }
    this.updateRecipes(newRecipes);
  },
  deleteRecipe: function(keyToDelete) {
    var recipes = this.state.data;
    var newRecipes = [];
    for (var i in recipes) {
      if (recipes[i].id !== keyToDelete) newRecipes.push(recipes[i]);
    }
    $('.accordion').foundation('toggle', $('is-active'));
    this.updateRecipes(newRecipes);
  },
  render: function() {
    return (
      <div className="recipe-box column small-12 medium-10 medium-centered large-8">
        <h1 className="recipe-box__title">Your Recipes</h1>
        <RecipeList
          deleteRecipe={this.deleteRecipe}
          editRecipe={this.editRecipe}
          data={this.state.data}
          />
        <button className="recipe-box__add button" data-open="add-recipe-modal">Add Recipe</button>
        <RecipeModal
          submitRecipe={this.submitRecipe}
          />
      </div>
    )
  }
});

var RecipeModal = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      ingredients: [],
      id: ''
    }
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleIngredientsChange: function(e) {
    this.setState({ingredients: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var ingredients = this.state.ingredients.split(',');
    ingredients = ingredients.map(function(str) {
      return str.trim();
    });
    var id = Date.now();
    if (!name || !ingredients) return;
    this.setState({name: '', ingredients: [], id:''});
    this.props.submitRecipe({name: name, ingredients: ingredients, id: id});
    $('#add-recipe-modal').foundation('close');
  },
  render: function() {
    return (
      <div className="reveal" id="add-recipe-modal" data-reveal>
        <h2 className="reveal__title">Add a Recipe</h2>
        <form
          onSubmit={this.handleSubmit}>
          <label>Recipe
            <input type="text" placeholder="Recipe Name"
              value={this.state.name}
              onChange={this.handleNameChange} />
          </label>
          <label>Ingredients
            <textarea placeholder="Ingredients, separated, by, commas"
              value={this.state.ingredients}
              onChange={this.handleIngredientsChange} />
          </label>
          <input type="submit" className="button" value="Add Recipe" />
          <a className="secondary button"
            onClick={() => $('#add-recipe-modal').foundation('close') }>Close</a>
        </form>
      </div>
    )
  }
});

var RecipeList = React.createClass({
  editRecipe: function(editedRecipe) {
    this.props.editRecipe(editedRecipe);
  },
  deleteRecipe: function(keyToDelete) {
    this.props.deleteRecipe(keyToDelete);
  },
  render: function() {
    var recipeList = this.props.data.map(function(recipe) {
      return (
        <Recipe
          name={recipe.name}
          ingredients={recipe.ingredients}
          id={recipe.id}
          editRecipe={this.editRecipe}
          deleteRecipe={this.deleteRecipe} />
      )
    }, this);
    return (
      <ul className="recipe-box__list accordion"
        data-accordion
        data-allow-all-closed="true">
        {recipeList}
      </ul>
    )
  }
});

var Recipe = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      ingredients: this.props.ingredients,
      id: this.props.id
    }
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleIngredientsChange: function(e) {
    this.setState({ingredients: e.target.value});
  },
  deleteRecipe: function() {
    var keyToDelete = this.props.id;
    this.props.deleteRecipe(keyToDelete);
  },
  editRecipe: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var ingredients = this.state.ingredients.split(',');
    ingredients = ingredients.map(function(str) {
      return str.trim();
    });
    var id = this.state.id;
    var editedRecipe = {name: name, ingredients: ingredients, id: id};
    $('#' + this.props.id).foundation('close');
    this.setState({name: name});
    this.setState({ingredients: ingredients});
    this.props.editRecipe(editedRecipe);
  },
  discardChanges: function() {
    $('#' + this.props.id).foundation('close');
    this.setState({name: this.props.name});
    this.setState({ingredients: this.props.ingredients});
  },
  render: function() {
    var ing = this.props.ingredients;
    var ingredientsList = ing.map(function(ingredient) {
      return (
        <li className="ingredients__item">{ingredient}</li>
      )
    });
    return (
      <li className="accordion-item" data-accordion-item>
        <a href="#" className="accordion-title">{this.props.name}</a>
        <div className="accordion-content" data-tab-content>
          <h3 className="ingredients__title">Ingredients</h3>
          <hr />
          <ul className="ingredients__list">
            {ingredientsList}
          </ul>
          <div className="button-group">
            <a className="secondary button"
              data-open={this.props.id}>
              Edit</a>
            <a className="alert button"
              onClick={this.deleteRecipe}>
              Delete</a>
          </div>
        </div>
        <div className="reveal" id={this.props.id} data-reveal>
          <h2 className="reveal__title">Add a Recipe</h2>
          <form
            onSubmit={this.editRecipe}>
            <label>Recipe
              <input type="text" placeholder="Recipe Name"
                value={this.state.name}
                onChange={this.handleNameChange} />
            </label>
            <label>Ingredients
              <textarea placeholder="Ingredients, separated, by, commas"
                value={this.state.ingredients}
                onChange={this.handleIngredientsChange} />
            </label>
            <input type="submit" className="button" value="Confirm Changes" />
            <a className="secondary button"
              onClick={this.discardChanges}>Discard Changes</a>
          </form>
        </div>
      </li>
    )
  }
});

ReactDOM.render (
  <RecipeBox />,
  document.getElementById('container')
);

$(document).foundation();