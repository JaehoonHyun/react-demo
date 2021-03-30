import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// class Square extends React.Component {

//     constructor(props) {
//         super(props); //생성자 만들 떄 명시적으로 상위클래스 호출해줘야함

//         //state는 이미 약속된 변수임 setState 메소드를 이용해서 컨트롤가능
//         this.state = {
//             value: null,
//         }
//     }
//     render() {
//         //사각형에 onClick 이벤트가 호출되면 this.props.onClick 함수를 호출하네
//         //this.props를 board가 override해놨음 그래서 호출되면 board의 handleClick 함수가 호출됨
//         return (
//             <button className="square" onClick={() => this.props.onClick()} >
//                 {this.props.value}
//             </button>
//         )
//     }
// }

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            //null로 채운다.
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice() //배열을 복사한다
        //이미 승리하였으면 무시.
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O"
        this.setState({squares: squares, xIsNext: !this.state.xIsNext}) //TODO: 해당자리에 중복으로는 놓는경우 에러처리
    }

    renderSquare(i) {
        return (
            <Square 
            value={this.state.squares[i]} 
            onClick={() => this.handleClick(i)}
            />
        )
    }

    

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
      

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{ /* status */}</div>
                    <ol>{ /* TODO */ }</ol>
                </div>
            </div>
        )
    }
}

// ====================================
// public/index.html에서     <div id="root"></div> 이기 떄문에 root에 템플릿을 걸어줘야한다.
ReactDOM.render(
    <Game />,
    document.getElementById('root')
)

// helper function
function calculateWinner(squares) {
    //줄, 열, 대각선 인덱스에 모두 O이거나 X이면 이김
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

/*
debugging 하는 법
크롬 개발자도구에서 crtl + shift + c 
누르면 inspect 됨
*/
