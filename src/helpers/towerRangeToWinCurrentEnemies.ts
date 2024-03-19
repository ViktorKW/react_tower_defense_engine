import { IEnemy } from "../store/gameSlice"
import advanceEnemies from "./advanceEnemies"
import getAllMostDangerousEnemies from "./getAllMostDangerousEnemies"
import getEnemiesWithinRange from "./getEnemiesWithinRange"
import getMostDangerousEnemy from "./getMostDangerousEnemy"
import removeEnemy from "./removeEnemy"

function areEnemiesInRange(enemies:IEnemy[], range:number) {
    for(const enemyItem of enemies) {
        if(enemyItem.distance <= range) {
            continue
        } else {
            return false
        }
    }

    return true
}

function checkIfLoss(enemies:IEnemy[], range:number) {
    const allMostDangerousEnemies = getAllMostDangerousEnemies(enemies)

    if(allMostDangerousEnemies.length > 1) {
        //TOO MANY ENEMIES
        return true
    } else if(!areEnemiesInRange(allMostDangerousEnemies, range)) {
        //TOO DANGEROUS ENEMY OUT OF RANGE
        return true
    }

    return false
}


export default function towerRangeToWinCurrentEnemies(initialEnemies:IEnemy[]) {
    const { distance: maxRangeAllowed} = initialEnemies.reduce(
        (prev, current) => prev.distance > current.distance ? prev : current
    )

    const simulator = (enemies:IEnemy[], range:number): number => {
        if (!enemies.length) {
            return range
        }
    
        if(checkIfLoss(enemies, range) === true) {
            //IF LOSS
            return 0
        } else if(checkIfLoss(enemies, range) === false) {
            //IF SURVIVED
            const enemiesInRange = getEnemiesWithinRange(enemies, range)
            const mostDangerous = getMostDangerousEnemy(enemiesInRange)
    
            if(mostDangerous) {
                //IF SHOOTING
                const newEnemies = [...advanceEnemies([...removeEnemy(enemies, mostDangerous.id)])]
                return simulator([...newEnemies], range)
            } else {
                const newEnemies = advanceEnemies([...enemies])
                return simulator([...newEnemies], range)
            }
        }

        return 0
    }

    let lastWinRange = 0
    for(let i = maxRangeAllowed; i > 0; i--) {
        const result = simulator([...initialEnemies], i)
        if(result > 0) {
            lastWinRange = result
        } 
    }
    return lastWinRange > 0 ? lastWinRange : -1
}