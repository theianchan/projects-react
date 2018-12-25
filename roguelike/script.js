var GameBoard = React.createClass({
  getInitialState : function() {
    return {
      x : '',
      y : '',
      board : {}
    }
  },
  componentDidMount : function() {
    this.newBoard(20, 20);
  },
  newBoard : function (x, y) {
    var board = {'0204' : 'player'};
    this.setState({
      x : x,
      y : y,
      board: board
    });
  },
  renderBoard : function() {
    var board = this.state.board;
    var x = this.state.x;
    var y = this.state.y;
    var html = '<div class=row>';

    for (var i = 0; i < y; i++) {
      for (var j = 0; j < x; j++) {
        var yString = i < 10 ? '0' + i : i.toString();
        var xString = j < 10 ? '0' + j : j.toString();

        var currentCell = xString + yString;
        var cellOccupied = (board.hasOwnProperty(currentCell));

        if (cellOccupied) {
          html += '<div class="cell cell--player"></div>';
        } else {
          html += '<div class="cell cell--empty"></div>';
        }
      }

      html += '</div>';
      if ((i+1) !== y) html += '<div class=row>';
    }

    $('.world-map').html(html);
  },
  render: function() {
    this.renderBoard(10, 10);
    return (
      <div className="world-map">
        <Player />
      </div>
    )
  }
});

var Player = React.createClass({
  render: function() {
    return (
      <div className="player">
      </div>
    )
  }
})

ReactDOM.render (
  <GameBoard />,
  document.getElementById('container')
);