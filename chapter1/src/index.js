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

/*
중요 : 
버튼에 onClick 이벤트 발생 
-> sqaure 컴포넌트가 객체화된 props의 onClick 호출 
-> board가 square 컴포넌트를 객체화함. (board의 renderSquares 함수)
-> board의 renderSquares 함수에서 sqaure props의 onclick을 this.props.onclick을 호출하도록 함, 이 때 squares의 i가 걸림
-> this.props.onClick은 Game Component에서 Board를 객체화함으로써 걸림
-> Game Component의 board를 객체화한 곳에 props의 onClick은 파라미터를 i를 받아서 처리함 
-> this.handleClick에 파라미터 i를 넘겨서 Game Component에서 핸들링 가능함

결론: 클로져 개념이 들어갔다.
*/
function Square(props) {
    return (
        // props에 정의된 onClick함수를 호출함
        <button className="square" onClick={props.onClick}>
            {/* 여기서 O, X만 전달됨 */}
            {props.value} 
        </button>
    )
}

class Board extends React.Component {

    //여기서 sqaures의 인덱스를 주입함. ㄷㄷ
    renderSquare(i) {
        return (
            <Square 
            value={this.props.squares[i]} //square component의 props의 values로 전달됨
            onClick={() => this.props.onClick(i)} //square component의 props의 onClick으로 전달됨, 이건 Game Component에서 또 hook함
            />
        )
    }

    

    render() {
        return (
            <div>
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

    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    jumpTo(step) {
        this.setState(
            {
                stepNumber: step,
                xIsNext: (step % 2) === 0,
            }
        )
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        //이미 승리하였으면 무시.
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O"
        this.setState(
            {
                history: history.concat(
                    [
                        {
                            squares: squares,
                        },
                    ]
                ),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
            }) //TODO: 해당자리에 중복으로는 놓는경우 에러처리
    }

    render() {

        //이전 history로 돌아가는 경우 stepNumber까지의 상태를 저장한다.
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move ?
                "Go to move #" +move:
                "GO to game start"

            return (
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status
        if(winner) {
            status = "Winner: " + winner
        }else{
            status = "Next Player is " + (this.state.xIsNext ? "X" : "O") //괄호 필수
        }

        return (
            <div className="game">
                <div className="game-board">
                    {/* onclick이라는 함수가 어케 squrare의 i를 파라미터를 받을 수 있는거지? */}
                    {/* onClick이라는 함수를 props에 추가함. 얘는 game의 handleClick을 호출함 */}
                    <Board squares={current.squares} onClick={(i)=> this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
