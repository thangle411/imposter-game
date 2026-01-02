import type { Player, Role, SetupData } from '@/types/game'

export function assignRoles({ totalPlayers, spyPupCount, confusedKittenCount }: Pick<SetupData, 'totalPlayers' | 'spyPupCount' | 'confusedKittenCount'>): Role[] {
  const roles: Role[] = []

  for (let i = 0; i < spyPupCount; i++) {
    roles.push('spy-pup')
  }
  
  for (let i = 0; i < confusedKittenCount; i++) {
    roles.push('confused-kitten')
  }
  
  // rest are good kittens
  while (roles.length < totalPlayers) {
    roles.push('good-kitten')
  }
  
  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]]
  }
  
  return roles
}

export function assignWords(
  players: Player[],
  wordPair: { main: string; related: string }
): { players: Player[]; realWord: string } {
  const updatedPlayers = players.map(player => {
    if (player.role === 'good-kitten') {
      return { ...player, word: wordPair.main }
    } else if (player.role === 'confused-kitten') {
      return { ...player, word: wordPair.related }
    } else {
      // spy pup gets no word
      return { ...player, word: undefined }
    }
  })
  
  return {
    players: updatedPlayers,
    realWord: wordPair.main
  }
}