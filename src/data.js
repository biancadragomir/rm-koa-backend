export const characterNames = ['Beth', 'Rick', 'Morty', 'Summer', 'Jerry'];
export const statuses = ['visited', 'postponed', 'cancelled', 'deadly'];
export const planetNames = ['Snake_Planet', 'Gaia', 'Unitys_Planet', 'Cronenberg_World'];
export const adventureStatuses = ['Successful', 'Failed', 'Destroyed the Multiverse', 'Got sued by the Council of Ricks'];
export const adventureRewards = ['Microverse Battery', 'Gwendolyn', 'Unlimited Interdimensional Cable Access']
export const gadgets = ['Meeseks', 'Knowledge', 'Gun', 'Taser']

const generateCharactersWithPictures = () => {
    let charactersMap = new Map();
    charactersMap.set('Rick', 'https://i.pinimg.com/originals/7b/aa/25/7baa252dbdfeed669c152bedd2fa5feb.jpg');
    charactersMap.set('Morty', 'https://occ-0-586-590.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABa10gCs1eiQ6_DpA9dsgS1Rhp313ueNrMCqS6JNbsy62Tc_b3709LRZBge3e9Zn6d0XCxtKQnEN5nGMCMCZ5Vj6IHkfZHmiBnHXcrY3gyewaiwUe.jpg?r=343');
    charactersMap.set('Beth', 'https://vignette.wikia.nocookie.net/ricksanchez/images/0/06/Beth.jpg/revision/latest/top-crop/width/360/height/450?cb=20160605180948');
    charactersMap.set('Jerry', 'https://www.pngitem.com/pimgs/m/26-261780_jerry-png-jerry-rick-and-morty-png-transparent.png');
    charactersMap.set('Summer', 'https://vignette.wikia.nocookie.net/rickandmorty/images/a/ad/Summer_is_cool.jpeg/revision/latest/top-crop/width/360/height/360?cb=20160919183158');
    return charactersMap;   
}

export const charactersWithPictures = generateCharactersWithPictures()