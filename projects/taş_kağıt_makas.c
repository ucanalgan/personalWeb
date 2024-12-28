#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define STONE 's'
#define PAPER 'p'
#define SCISSOR 'z'

int game(char you, char computer)
{
    if (you == computer)
        return -1;

    if (you == STONE && computer == PAPER)
        return 0;
    else if (you == PAPER && computer == STONE)
        return 1;

    if (you == STONE && computer == SCISSOR)
        return 1;
    else if (you == SCISSOR && computer == STONE)
        return 0;

    if (you == PAPER && computer == SCISSOR)
        return 0;
    else if (you == SCISSOR && computer == PAPER)
        return 1;
}

int main()
{
    int n;
    char you, computer, result;

    srand(time(NULL));
    n = rand() % 100;

    if (n < 33)
        computer = STONE;
    else if (n > 33 && n < 66)
        computer = PAPER;
    else
        computer = SCISSOR;

    printf("\n\n\n\n\t\t\t\tEnter %c for STONE, %c for PAPER and %c for SCISSOR\n\t\t\t\t\t\t\t", STONE, PAPER, SCISSOR);
    scanf(" %c", &you);

    result = game(you, computer);

    if (result == -1) {
        printf("\n\n\t\t\t\tGame Draw!\n");
    } else if (result == 1) {
        printf("\n\n\t\t\t\tWow! You have won the game!\n");
    } else { 
        printf("\n\n\t\t\t\tOh! You have lost the game!\n");
    }

    printf("\t\t\t\tYou choose : %c and Computer choose : %c\n", you, computer);

    return 0;
}