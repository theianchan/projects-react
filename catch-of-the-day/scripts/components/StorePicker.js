import React from 'react';
import {History} from 'react-router';
import h from '../helpers';

var StorePicker = React.createClass({
  mixins: [History],
  goToStore : function(e) {
    e.preventDefault();
    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);
  },
  render : function() {
    return (
      <form className="store-selector" onSubmit={this.goToStore} >
        <h2>Please Enter a Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
        <input type="Submit" />
      </form>
    )
  }
});

export default StorePicker;