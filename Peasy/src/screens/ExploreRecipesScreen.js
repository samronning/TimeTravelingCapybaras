import React, { Component }from 'react';
import { StyleSheet, Dimensions, View, Icon, TextInput, Text, TouchableOpacity, Image, Button, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import 'react-native-gesture-handler';
import ExploreGraphic from '../assets/bbq.svg';
import InexpensiveGraphic from '../assets/inexpensiveGraphic.svg'
import PopularGraphic from '../assets/popular.svg'
import HealthyGraphic from '../assets/salad.svg'
import styles from '../components/Styles/styles';
import { Data } from './response';
import HTML from "react-native-render-html";
import Collapsible from 'react-native-collapsible';

class  IngredientsDetailsScreen extends Component {
  exportIngredients(ingredients) {
    
  }
  render() {
    // extract ingredient list from API data
    var instructions = this.props.instructions;
    var ingredients = [];
    var test;
    for (let step of instructions) {
      for (let ingredientObj of step.ingredients) {
        test = ingredientObj.id;
        ingredients.push(ingredientObj.name);
      }
    }
    ingredients = [...new Set(ingredients)];
    return (
      <View>
                  <FlatList data={ingredients}
                  keyExtractor= {(item) => {
                    return item.toString();
                  }}
                  renderItem={({item}) => {
                  return (
                    <View style={styles2.item}>
                      <Text style={styles2.ingredients}> {item} </Text>
                    </View>
                    )}}/>
                    <Button onPress={this.exportIngredients(ingredients)} title="Save ingredients to shopping list ->" style={styles2.btnClose}/>
      </View>
  );
 };
}
class  InstructionsDetailsScreen extends Component {
  render() {
    // extract ingredient list from API data
    var instructionsRaw = this.props.instructions;
    var instructions = [];
    var test;
    for (let step of instructionsRaw) {
      instructions.push(step.step);
    }
    return (
      <View>
                  <FlatList data={instructions}
                  keyExtractor= {(item) => {
                    return item.toString();
                  }}
                  renderItem={({item}) => {
                  return (
                    <View style={styles2.item}>
                      <View style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "lightgrey",
                      }}/>
                      <Text style={styles2.instructions}> {item} </Text>
                    </View>
                    )}}/>
      </View>
  );
 };
}
export default class ExploreRecipesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible:false,
      selectedRecipe: Data[0],
      data: Data,
      filteredData: Data,
      searchedData: Data,
      searchText: '',
      inexpensiveFilter: false,
      popularFilter: false,
      healthyFilter: false,
      ingredientsCollapsed: true,
      descriptionCollapsed: true,
      instructionsCollapsed: true
    };
  }
  toggleExpanded(type) {
    switch(type) {
      case 'ingredients':
        this.setState({ingredientsCollapsed: !this.state.ingredientsCollapsed});
        return;
      case 'description':
        this.setState({descriptionCollapsed: !this.state.descriptionCollapsed});
        return;
      case 'instructions':
        this.setState({instructionsCollapsed: !this.state.instructionsCollapsed});
        return;
      
    }
    
  };

  shuffle() {
    let e = this.state.data;
    for (let i = (e.length - 1); i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = e[i]
      e[i] = this.state.filteredData[j]
      e[j] = temp
    }
    this.state.data = e;
  }
  clickEventListener = (item) => {
    this.setState({selectedRecipe: item}, () =>{
      this.setModalVisible(true);
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  saveRecipe(recipe) {
    
  }
  filter(type) {
    switch(type) {
      case 'inexpensive':
        this.state.inexpensiveFilter ? this.setState({inexpensiveFilter: false, data: Data}) : this.setState({inexpensiveFilter: true, data: this.state.data.filter(x => 
          x.cheap == true)});
          this.shuffle();
        return;
      case 'healthy':
        this.state.healthyFilter ? this.setState({healthyFilter: false, data: Data}) : this.setState({healthyFilter: true, data: this.state.data.filter(x => 
          x.veryHealthy == true)});
          this.shuffle();
        return;
      case 'popular':
        this.state.popularFilter ? this.setState({popularFilter: false, data: Data}) : this.setState({popularFilter: true, data: this.state.data.filter(x => 
          x.veryPopular == true)});
          this.shuffle();
        return;
      default:
        return;
    }
  }
  render() {
    this.state.filteredData = this.state.searchText
      ? this.state.data.filter(x =>
          x.title.toLowerCase().includes(this.state.searchText.toLowerCase())
        )
      : this.state.data;
    return (
      <View>
      <ScrollView>
      <View >
              <View style={{    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: "auto",
    marginTop: 20,
    padding: 50}}>
      <Text style={styles.header}>Thousands of recipes, at your fingertips.</Text>
      <View style={styles.logoContainer}>
        <ExploreGraphic width={240} height={240}/>
      </View>
      <Text style={styles.h2}>Start exploring and see what's for dinner!</Text>
    </View>
    <View >
          <TextInput
            style={styles.inputBox}
            placeholderTextColor="grey"
            selectionColor="black"
            keyboardType="default"
            onChangeText={text => this.setState({ searchText: text })}
            value={this.state.searchText}
            placeholder="Search by name or ingredient"
          />
          <View style={styles.searchFilterContainer}>
            <Text style={styles.h2}>Filter:</Text>
            <TouchableOpacity onPress={() => this.filter('inexpensive')}>
                <Text style={this.state.inexpensiveFilter ? {color:'#3aa43e'} : {color: '#808080'}}>CHEAP</Text>
              {/* <InexpensiveGraphic style={this.state.inexpensiveFilter ? {opacity: 1} : {opacity: .5}} width={50} height={50}/> */}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.filter('healthy')}>
              <Text style={this.state.healthyFilter ? {color:'#3aa43e'} : {color: '#808080'}}>HEALTHY</Text>
              {/* <HealthyGraphic style={this.state.healthyFilter ? {opacity: 1} : {opacity: .5}} width={50} height={50} /> */}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.filter('popular')}>
              <Text style={this.state.popularFilter ? {color:'#3aa43e'} : {color: '#808080'}}>POPULAR</Text>
              {/* <PopularGraphic style={this.state.popularFilter ? {opacity: 1} : {opacity: .5}} width={50} height={50} /> */}
            </TouchableOpacity>
          </View>
    </View>
        <FlatList 
          data={this.state.filteredData}
          keyExtractor= {(item) => {
            return item.id.toString();
          }}
          renderItem={({item}) => {
          return (
            <TouchableWithoutFeedback style={styles2.card} onPress={() => {this.clickEventListener(item)}}>
              <View style={{backgroundColor:'white', marginBottom: 10}}>
                <View style={styles2.header}>
                <Text style={styles2.recipeTitle}>{item.title}</Text>
                <View style={{flex: 1}}>
                  {item.cheap && <Text style={{color: '#808080'}}>CHEAP</Text>}
                  {item.veryHealthy && <Text style={{color: '#808080'}}>HEALTHY</Text>}
                  {item.veryPopular && <Text style={{color: '#808080'}}>POPULAR</Text>}
                </View>
                </View>  

                <Image source={{uri: item.image}} style={{height: 200, width: Dimensions.get('screen').width, flex: 1}}/>
                <View style={styles2.recipeHighlights}>
                  <View style={{flex: 1}}>
                  <Text style={{fontSize:20}} >
                      {item.readyInMinutes}
                    </Text>
                      <Text>minutes to prepare</Text>
                  </View>
                    
                  <View style={{flex: 1}}>
                  <Text style={{fontSize:20}} >
                  ${(item.pricePerServing/100).toFixed(2)}
                    </Text>
                      <Text>per serving</Text>
                  </View>
              </View>  
              </View>
            </TouchableWithoutFeedback>
          )}}/>

        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this.setModalVisible(false)}
          visible={this.state.modalVisible}>
          <View style={styles2.popupOverlay}>
            <View style={styles2.popup}>
              <View style={styles2.popupContent}>
              <ScrollView contentContainerStyle={styles2.modalInfo}>
              <View style={styles2.popupButtons}>
                <TouchableOpacity onPress={() => {this.setModalVisible(false) }} style={{width: "100%"}} >
                  <Text style={{fontWeight: '100', fontSize: 20}}>X</Text>
                </TouchableOpacity>
                </View>
                <View style={styles2.detailsHeader}>
                <View style={{flex: 2}}>
                  <Text style={styles2.name}>{this.state.selectedRecipe.title}</Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={styles2.recipeDetailsHighlights}>
                    <View style={{flex: 1, padding: 5}}>
                    <Text style={{fontSize:20}} >
                        {this.state.selectedRecipe.readyInMinutes}
                      </Text>
                        <Text>minutes to prepare</Text>
                    </View>
                    <View style={{flex: 1, padding: 5}}>
                      <Text style={{fontSize:20}} >
                      ${(this.state.selectedRecipe.pricePerServing/100).toFixed(2)}
                        </Text>
                          <Text>per serving</Text>
                    </View>
                  </View>
                </View>
                </View> 
                <Image source={{uri: this.state.selectedRecipe.image}} style={{height: 200, width: Dimensions.get('screen').width, flex: 1}}/>
                <TouchableOpacity onPress={() => {this.toggleExpanded('description')}}>
                <View>
                  <Text style={styles.h2}>
                    Description
                  </Text>
                </View>
                </TouchableOpacity>
                <Collapsible
                collapsed={this.state.descriptionCollapsed}
                align="center"
                 >
                <View>
                <HTML source={{ html: this.state.selectedRecipe.summary}} contentWidth={100} style={{fontSize:20}}/>
                </View>
              </Collapsible>
              <TouchableOpacity onPress={() => {this.toggleExpanded('ingredients')}}>
                <View>
                  <Text style={styles.h2}>
                    Ingredients
                  </Text>
                </View>
              </TouchableOpacity>
              <Collapsible
                collapsed={this.state.ingredientsCollapsed}
                align="center"
              >
                <IngredientsDetailsScreen instructions={this.state.selectedRecipe.analyzedInstructions[0].steps} />
              </Collapsible>
              <TouchableOpacity onPress={() => {this.toggleExpanded('instructions')}}>
                <View>
                  <Text style={styles.h2}>
                    Instructions
                  </Text>
                </View>
                </TouchableOpacity>
                <Collapsible collapsed={this.state.instructionsCollapsed} align="center">
                  <View>
                    <InstructionsDetailsScreen instructions={this.state.selectedRecipe.analyzedInstructions[0].steps} />
                  </View>
              </Collapsible>
              <Button onPress={this.saveRecipe(this.state.selectedRecipe)} title="Save Recipe" style={styles2.btnClose}/>
                </ScrollView>
              </View>
              
            </View>
          </View>
        </Modal>
      </View>
      </ScrollView>
      </View>
    );
  }
}

const styles2 = StyleSheet.create({
  recipeDetailsHighlights: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    fontSize: 15,
  },
  detailsHeader: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10
  },
  ingredients: {
    fontSize: 20
  },
  instructions: {
    fontSize: 20,
    margin: 10
  },
  recipeHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    fontSize: 15,

  },
  recipeTitle:{
    flex: 3,
    fontSize:20,
    alignSelf:'center',
    color: '#808080',
    fontWeight:'bold'
  },
  header:{
    flexDirection: 'row', 
    flexBasis:40, 
    justifyContent: 'space-around',
    padding: 10
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
    flex:1,
  },
  detailContent:{
    top:80,
    height:500,
    width:Dimensions.get('screen').width - 90,
    marginHorizontal:30,
    flexDirection: 'row',
    position:'absolute',
    backgroundColor: "#ffffff"
  },
  image:{
    width:90,
    height:90
  },



  card:{
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 10,
    marginHorizontal:0,
    backgroundColor:"white",
    flexBasis: '46%',
    flexDirection:'row'
  },

  name:{
    fontSize:30,
    flex:2,
    color: '#808080',
    alignSelf: 'center',
    fontWeight:'bold'
  },
  position:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },
 /************ modals ************/
  popup: {
    backgroundColor: 'white',
    borderRadius: 7,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1
  },
  popupContent: {
    //alignItems: 'center',
    margin: 5,
    height:Dimensions.get('screen').height,
    marginTop: 50,
    marginBottom: 50
  },
  popupHeader: {
    marginBottom: 45
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent:'center'
  },
  popupButton: {
    flex: 1,
    marginVertical: 16
  },
  btnClose:{
    height:20,
    backgroundColor:'#20b2aa',
    padding:20
  },
  modalInfo:{
    alignItems:'center',
    justifyContent:'center',
  }
});
