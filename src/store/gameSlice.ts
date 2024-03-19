import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import getEnemiesWithinRange from "../helpers/getEnemiesWithinRange"
import getMostDangerousEnemy from "../helpers/getMostDangerousEnemy"
import removeEnemy from "../helpers/removeEnemy"
import advanceEnemies from "../helpers/advanceEnemies"
import towerRangeToWinCurrentEnemies from "../helpers/towerRangeToWinCurrentEnemies"

interface ITower {
    range: number,
}

export interface IEnemy {
    id: string,
    name: string,
    distance: number,
    speedMS: number
}

type TGameStatus = "loss" | "win" | "ongoing" | "idle"

interface IGame {
    turnNumber: number,
    tower: ITower,
    enemies: IEnemy[],
    gameStatus: TGameStatus,
    logs: string
}

interface IGameWithHistory extends IGame {
    gameHistory: IGame[]
}

const initialPosition: IGame = {
    logs: "",
    turnNumber: 0,
    gameStatus:"idle",
    tower: { 
        range: 3,
    },
    enemies: [{
        id: "1",
        name: "Bot1",
        distance: 15,
        speedMS: 3
    },
    {
        id: "2",
        name: "Bot2",
        distance: 15,
        speedMS: 3
    },
    {
        id: "3",
        name: "Bot3",
        distance: 15,
        speedMS: 3
    },
    {
        id: "4",
        name: "Bot4",
        distance: 20,
        speedMS: 10
    },
    {
        id: "5",
        name: "Bot5",
        distance: 20,
        speedMS: 10
    },
    {
        id: "8",
        name: "BotSlow",
        distance: 50,
        speedMS: 5
    }]
}

const initialState:IGameWithHistory = {
    gameHistory: [],
    ...initialPosition
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        addEnemy(state, action: PayloadAction<IEnemy>) {
            state.enemies.push(action.payload)
        },
        setTowerRange(state, action: PayloadAction<number>) {
            state.tower = { range: action.payload }
        },
        setGameStatus(state, action: PayloadAction<TGameStatus>) {
            state.gameStatus = action.payload
        },
        updateGameHistory(state) {
            const { gameHistory, ...stateWithoutHistory } = state
            const newGameHistory = [...gameHistory] 
            newGameHistory.push({ ...stateWithoutHistory }) 
            return {
                ...state,
                gameHistory: newGameHistory, 
            }
        },
        playTurn(state) {
            state.turnNumber = state.turnNumber + 1

            const { range } = state.tower
            const enemiesInRange = getEnemiesWithinRange([...state.enemies], range)
            const targetEnemy = getMostDangerousEnemy(enemiesInRange)

            if(targetEnemy) {
                const {id, name, distance} = targetEnemy
                state.logs = state.logs +`\nTURN ${state.turnNumber}. Tower shoots ${name} at ${distance}m away`

                state.enemies = removeEnemy([...state.enemies], id)
            } else {
                state.logs = state.logs +`\nTURN ${state.turnNumber}. Tower holds fire`
            }
    
            state.logs = state.logs +"\nEnemies approaching"

            state.enemies = advanceEnemies([...state.enemies])

            const enemyAtTower = state.enemies.find((enemyItem) => {
                return enemyItem.distance <=0
            })
    
            if(enemyAtTower) {
                const requiredRange = towerRangeToWinCurrentEnemies([...state.gameHistory[0].enemies])
                const logsReply = requiredRange > 0 ? `Tower can win! Minimal range required: ${requiredRange}` : "TOWER CAN'T WIN THIS"
                state.logs = state.logs +`\nTower LOSS to ${enemyAtTower.name} in ${state.turnNumber} turn(s)\n${logsReply}`
                state.gameStatus = "loss"
            }
            else if(state.enemies.length === 0) {
                state.logs = state.logs +`\nTower WIN in ${state.turnNumber} turn(s)`
                state.gameStatus = "win"
            } 
        },
        resetGame() {
            return initialState
        }
    },
})

export const { addEnemy, setTowerRange, setGameStatus, resetGame, updateGameHistory, playTurn } = gameSlice.actions
export default gameSlice.reducer