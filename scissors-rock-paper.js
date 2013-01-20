$(function(){
                    // scissors == 0, rock == 1, paper == 2
                    var count = [ [0, 0, 0], 
                    [0, 0, 0], 
                    [0, 0, 0] ];

                    $('#btnS').click(function(){
                        run(0);
                    });

                    $('#btnR').click(function(){
                        run(1);
                    });

                    $('#btnP').click(function(){
                        run(2);
                    });

                    var guess = 0;  // our guess for the next play
                    var last = 0;   // user's input for the last play
                    var total = 0;
                    var win = 0;
                    // process for every input
                    function run(input) // input is for current play
                    {
                        total++;

                        // judge and prompt result
                        var resultText = '';
                        if (guess == 0 && input == 1 || guess == 1 && input == 2 || guess == 2 && input == 0)
                        {
                            resultText = 'You win!';
                            win++;
                        }
                        if (guess == 0 && input == 2 || guess == 1 && input == 0 || guess == 2 && input == 1)
                        resultText = 'You lose!';
                        if (guess == input)
                        resultText = 'Tie!';
                        resultText += ' You have won ' + win + '/' + total + '.';
                        $('#result').html(resultText);

                        // update our model
                        count[last][input]++;
                        last = input;

                        // update guess
                        // arg max_i count[last][i]
                        var m = 0;
                        for (var i = 1; i < 3; i++)
                        if (count[last][i] > count[last][m])
                        m = i;
                        if (m == 0) guess = 1;
                        if (m == 1) guess = 2;
                        if (m == 2) guess = 0;
                        $('#guess').html('Next guess: ' + (guess == 1 ? 'Rock' : guess == 2 ? 'Paper' : 'Scissors'));

                        // visualize the state tranfer matrix
                        for (var i = 0; i < 3; i++)
                        for (var j = 0; j < 3; j++)
                        $('#t' + i.toString() + j.toString()).html(count[i][j]);
                    }
                });
