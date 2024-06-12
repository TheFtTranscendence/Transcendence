window.onload = init;

function init() {
    nickList = [];
    document.getElementById("4p").addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('tournament-menu').classList.add('hidden');
        document.getElementById('4pform').classList.remove('hidden');
    
        nickList = getTournamentNicknames(4);
        console.log(nickList);
    });
    
    document.getElementById("8p").addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('tournament-menu').classList.add('hidden');
        document.getElementById('8pform').classList.remove('hidden');
    
        nickList = getTournamentNicknames(8);
        console.log(nickList);
    });

}

function getTournamentNicknames(size)
{
    const nickList = [];
    const tournamentForm = document.createElement('div');
    tournamentForm.id = 'tourForm';

    document.body.appendChild(tournamentForm);

    for (let i = 0; i < size; i++)
    {
        const boxLabel = document.createElement('label');
        boxLabel.id = 'bLabel';
        boxLabel.textContent = 'Player' + (i + 1);

        const inputBox = document.createElement('input');
        inputBox.id = 'nickBox' + i;
        inputBox.type = 'text';

        tournamentForm.appendChild(boxLabel);
        tournamentForm.appendChild(inputBox);
        tournamentForm.appendChild(document.createElement('br'));
        
    }

    const okButton = document.createElement('button');
    okButton.textContent = "Save";
    okButton.id = 'acceptNick';

    tournamentForm.appendChild(okButton);

    tournamentForm.querySelector('#acceptNick').addEventListener('click', function() {
        for (let i = 0; i < size; i++)
        {
            const nick = document.getElementById('nickBox' + i).value;
            nickList.push(nick);
        }
        document.body.removeChild(tournamentForm);
    });
    return nickList;
}