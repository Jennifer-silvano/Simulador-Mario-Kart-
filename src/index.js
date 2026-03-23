const readline = require('readline');

const characters = [
    { NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0 },
    { NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0 },
    { NOME: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
    { NOME: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0 },
    { NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
];

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandonBlock(){
    let random = Math.random();;
    let result ;

    switch (true) {
        case random < 0.33:
          result = "RETA"
          break;
        case random < 0.66:
          result = "CURVA"
          break;
        default:
          result = "CONFRONTO"
            
    }
    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
      console.log(
        `${characterName} 🎲rolou um dado de  ${block} ${diceResult} + ${attribute} = ${
            diceResult + attribute
        }`
    );
}


async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round} 🏁`);

       // sortear bloco
       let bloco = await getRandonBlock();
         console.log(`Bloco sorteado: ${bloco}`);

         //rolar dados
       let dice1 = await rollDice();
       let dice2 = await rollDice();

         //teste de habilidade
       let TotaltestSkill1 = 0;
       let TotaltestSkill2 = 0;

       if(bloco === "RETA"){
          TotaltestSkill1 = dice1 + character1.VELOCIDADE ;
          TotaltestSkill2 = dice2 + character2.VELOCIDADE ;

          await logRollResult(
            character1.NOME, 
            "VELOCIDADE", dice1, 
            character1.VELOCIDADE
        );
          await logRollResult(
            character2.NOME, 
            "VELOCIDADE", 
            dice2, 
            character2.VELOCIDADE
        );
        }
              
           if(bloco === "CURVA"){
             TotaltestSkill1 = dice1 + character1.MANOBRABILIDADE ;
             TotaltestSkill2 = dice2 + character2.MANOBRABILIDADE ;

             await logRollResult(
                character1.NOME, 
                "MANOBRABILIDADE", 
                dice1, 
                character1.MANOBRABILIDADE);

             await logRollResult(
                character2.NOME, 
                "MANOBRABILIDADE", 
                dice2, 
                character2.MANOBRABILIDADE
            );
         }

         if(bloco === "CONFRONTO"){
            let power1 = dice1 + character1.PODER ;
            let power2 = dice2 + character2.PODER ;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

            await logRollResult(
                character1.NOME, 
                "PODER", 
                dice1, 
                character1.PODER
            );

            await logRollResult(
                character2.NOME, 
                "PODER", 
                dice2, 
                character2.PODER
            );

            if(power1 > power2 && character2.PONTOS > 0 ? 1 : 0){
                console.log(`${character1.NOME} venceu o confronto! 🥇 ${character2.NOME} perdeu um ponto  🐢`);
                   character2.PONTOS --;
            }

            if (power2 > power1 && character1.PONTOS > 0 ? 1 : 0){
                console.log(`${character2.NOME} venceu o confronto! 🥇 ${character1.NOME} perdeu um ponto  🐢`);
                character1.PONTOS --;
            }
            console.log(power2 === power1 ? "Empate no confronto! Ninguém perde pontos." : "");
    
         }
    
        // determinar vencedor da rodada
         if (TotaltestSkill1 > TotaltestSkill2) {
            
            console.log(`${character1.NOME} marcou um ponto! 🏆`);
            character1.PONTOS++;
            }else if (TotaltestSkill2 > TotaltestSkill1) {
            console.log(`${character2.NOME} marcou um ponto! 🏆`);
            character2.PONTOS++;
        }

        console.log("-----------------------------------");
    }
}

async function determineWinner(character1, character2) {
    console.log(`🏁 Resultado Final 🏁`);
    console.log(`${character1.NOME}: ${character1.PONTOS} pontos`);
    console.log(`${character2.NOME}: ${character2.PONTOS} pontos`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n🎉 ${character1.NOME} é o vencedor!🏆🎉`);
    }else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n🎉 ${character2.NOME} é o vencedor!🏆🎉`);
    }else {
        console.log(`\n🤝 A corrida terminou em empate! 🏁`);
    }
}


async function selectCharacter(rl, playerNumber) {
    console.log(`Escolha o personagem para o Jogador ${playerNumber}:`);
    characters.forEach((char, index) => {
        console.log(`${index + 1}. ${char.NOME} (Velocidade: ${char.VELOCIDADE}, Manobrabilidade: ${char.MANOBRABILIDADE}, Poder: ${char.PODER})`);
    });

    return new Promise((resolve) => {
        rl.question(`Digite o número do personagem (1-${characters.length}): `, (answer) => {
            const index = parseInt(answer) - 1;
            if (index >= 0 && index < characters.length) {
                resolve({ ...characters[index] }); // Clona o objeto para evitar modificações globais
            } else {
                console.log("Seleção inválida. Tente novamente.");
                resolve(selectCharacter(rl, playerNumber));
            }
        });
    });
}

(async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("🚨🏁 Bem-vindo ao Simulador Mario Kart! 🏁🚨");

    const player1 = await selectCharacter(rl, 1);
    const player2 = await selectCharacter(rl, 2);

    rl.close();

    console.info(`🚨🏁 Corrida entre ${player1.NOME} e ${player2.NOME} começando...`);
    
    await playRaceEngine(player1, player2);
    await determineWinner(player1, player2);
})();
