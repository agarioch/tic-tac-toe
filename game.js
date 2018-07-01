$(function(){
    'use strict'
    var elMessage = $('.message');

    function Player(symbol) {
        this.symbol = symbol;
    }

    function Game(p1 = new Player('X'), p2 = new Player ('O')) {
        // initialize board [0, 1, .. 8]
        this.board = ['','','','','','','','',''];
        this.turn = 0;
        this.p1 = p1;
        this.p2 = p2;
        this.player = p1.symbol;
        $(".cell").empty();
        $(".cell").css('background-color', 'transparent');
        elMessage.empty();
    }   
    
    Game.prototype = {

        move: function(cell) {
            // if cell doesn't contain symbol
            if ($(cell).text().length > 0 ) {
                console.log("cell " + cell.id + " is full");
                return;
            } else {
                this.update_board(cell, this.p1.symbol);
                console.log(this.turn)
                if (this.check_win(this.board, this.player)) {
                    elMessage.text(this.player + ' wins!');
                    $(".cell").off();
                    return;
                } else if (this.turn >= 8) {
                    elMessage.text("It's a tie.");
                    return;
                } else {
                    //this.new_turn();
                    cell = $('#'+this.move_ai())[0];
                    this.update_board(cell, this.p2.symbol);
                    if (this.check_win(this.board, this.p2.symbol)) {
                        elMessage.text(this.p2.symbol + ' wins!');
                        $(".cell").off();
                        return;
                    } else if (this.turn >= 8) {
                        elMessage.text("It's a tie.");
                        return;
                    } else {
                    return;
                    }
                }
            }
        },

        update_board: function(cell, player) {
            // add symbol to cell
            cell.append(player);
            // update background color          
            if (player == this.p1.symbol){
                $(cell).css('background-color', '#B3C3E4');
            } else {
                $(cell).css('background-color', '#B3E4D4');
            }
            // insert symbol to board array 
            this.board[cell.id] = player;
            this.turn ++;
        },

        new_turn: function() {
            if(this.turn % 2 === 0) {
                this.player = this.p1.symbol;
            } else {
                this.player = this.p2.symbol;
            }
        },

        move_ai: function() {
            return this.minmax(this.board, 0, this.p2.symbol);
        },
        
        minmax: function(newBoard, depth, player) {
            //debugger
            
            if (this.available_moves(newBoard).length == 0) {
                // tie = 0
                return 0;
            } else if (this.check_win(newBoard,this.p1.symbol)) {
                // player win = -10 + depth
                return depth - 10;
            } else if (this.check_win(newBoard,this.p2.symbol)) {
                // ai win = + 10 - depth
                return 10 - depth;
            } else {
                // continue recursion
                var options = [];
                
                for (var i = 0; i < 9; i++) {
                    var copyBoard = _.cloneDeep(newBoard);
                    if (copyBoard[i] !== '') continue;
                    copyBoard[i] = player;
                    const score = this.minmax(copyBoard, depth + 1, (player === this.p2.symbol) ? this.p1.symbol : this.p2.symbol);
                    options.push({
                        weight: score,
                        cell: i
                    });
                }
            }

            if (player === this.p2.symbol) {
                const max = _.maxBy(options, (v) => {
                    return v.weight;
                });
                if (depth === 0) {
                    return max.cell;
                } else {
                    return max.weight;
                }
            } else {
                const min = _.minBy(options, (v) => {
                    return v.weight;
                });
                if (depth === 0) {
                    return min.cell;
                } else {
                    return min.weight;
                }
            }

        },
                
        available_moves: function(board) {
            return board.filter(cell => cell != 'X' && cell != 'O');
        },
        
        check_win: function(board, player) {
            if (
                (board[0] == player && board[1] == player && board[2]==player )||
                (board[3] == player && board[4] == player && board[5])==player ||
                (board[6] == player && board[7] == player && board[8]==player )||
                (board[0] == player && board[3] == player && board[6]==player )||
                (board[1] == player && board[4] == player && board[7]==player )||
                (board[2] == player && board[5] == player && board[8]==player) ||
                (board[0] == player && board[4] == player && board[8]==player) ||
                (board[6] == player && board[4] == player && board[2]==player)
            ) {
                return player;
            } else {
                return false;
            }
        }
    };
    
    
    var game = new Game();
    
    // player makes a move
    $(".cell").on('click', function() {
        game.move(this);
    });
    
    // player chooses to reset the game
    $(".reset").on('click', function() {
        game = new Game();
        $(".cell").on('click', function() {
            game.move(this);
        });
    });
});