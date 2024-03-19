import "./styles/main.scss"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./store/store"
import { IEnemy, addEnemy, playTurn, resetGame, setGameStatus, setTowerRange, updateGameHistory } from "./store/gameSlice"
import Input from "./components/Input"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import Button from "./components/Button"
import getMostDangerousEnemy from "./helpers/getMostDangerousEnemy"
import getEnemiesWithinRange from "./helpers/getEnemiesWithinRange"

interface ICommandForm {
    command: string
}

export default function App() {
    const { tower, enemies, gameStatus, turnNumber, logs } = useAppSelector(state => state.game)
    const dispatch = useAppDispatch()

    const newEnemyRegex = /^\w+\s+\d{1,3}m\s+\d{1,3}m$/
    const towerRangeRegex = /^\d+m$/

    const schema = yup.object().shape({
        command: yup.string().trim()
            .matches(new RegExp(`^(?:${newEnemyRegex.source}|${towerRangeRegex.source})`), "No such command"),
    })

    const methods = useForm<ICommandForm>({
        mode: "onChange",
        //@ts-ignore
        resolver: yupResolver(schema),
    })
    const { register, handleSubmit, formState, reset } = methods
    const { errors, isValid } = formState

    const executeCommand = ({command}:ICommandForm) => {
        if(newEnemyRegex.test(command)) {
            const parts = command.split(" ")
            const newEnemy:IEnemy = {
                id: `${new Date().getTime()}`,
                name: parts[0],
                distance: parseInt(parts[1]),
                speedMS: parseInt(parts[2])
            }

            dispatch(addEnemy(newEnemy))
        } else if (towerRangeRegex.test(command)) {
            const newTowerRange = parseInt(command)
            dispatch(setTowerRange(newTowerRange))
        }

        reset()
    }

    

    const mostDangerousEnemy = () => {
        const targetEnemy = getMostDangerousEnemy(enemies)

        if(targetEnemy) {
            const {name, distance, speedMS} = targetEnemy
            return (
                <ul className="pl20">
                    <li>Name: {name}</li>
                    <li>Distance from tower: {distance <=0 ? <b>in the tower</b> : `${distance}m`}</li>
                    <li>Speed: {speedMS}m/turn</li>
                    <li>Turns away from reaching the tower: {Math.ceil(distance/speedMS)}</li>
                </ul>
            )
        } else {
            return (
                <span>No enemies</span>
            )
        }
    }

    const handleTurn = () => {
        dispatch(playTurn())
    }

    useEffect(() => {
        if(gameStatus === "ongoing") {
            dispatch(updateGameHistory())
        }
    }, [turnNumber, enemies, tower])

    const handleTryAgain = () => {
        dispatch(resetGame())
    }
    const handleNewGame = () => {
        dispatch(updateGameHistory())
        dispatch(setGameStatus("ongoing"))
    }

    return (
        <div className="flex-column g20 p10">
            <div>
                <h3>Commands:</h3>
                <ol className="w100">
                    <li>Set tower range: <b>50m</b></li>
                    <li>Create new enemy: <b>BotName 100m 10m</b></li>
                </ol>
            </div>
        
            <form className="flex-column g5">
                <Input 
                    name="command"
                    label="Name" 
                    error={errors.command}
                    register={register}
                    disabled = { gameStatus !== "idle" }
                />
                <Button 
                    type="submit" 
                    disabled={!isValid || gameStatus !== "idle"}
                    onClick={handleSubmit(executeCommand)}
                    className="w25"
                >
                    Submit
                </Button>
            </form>

            <div className="flex-column g5">
                <h4>Game stats:</h4>
                
                <ul>
                    <li>
                        Tower firing range: {tower.range}m 
                        {" "} 
                        {getEnemiesWithinRange(enemies, tower.range).length ? `${"(In range)"}`:`${"(Out of range)"}`}
                    </li>
                    <li>Amount of enemies: {enemies.length}</li>
                    <li>Most dangerous enemy: { mostDangerousEnemy() }.</li>
                </ul>

                {
                    gameStatus === "idle" &&
                        <Button 
                            color="secondary"
                            onClick={() => handleNewGame()}
                        >
                            Start new game
                        </Button>
                }

                {
                    (gameStatus === "win" || gameStatus === "loss") &&
                        <Button 
                            color="warning"
                            onClick={() => handleTryAgain()}
                        >
                            Try again
                        </Button>
                }

                {
                    gameStatus === "ongoing" &&
                        <Button 
                            color="primary" 
                            onClick={() => handleTurn()}
                        >
                            Play Turn
                        </Button>

                }


            </div>

            <div className="flex-column g5">
                <h3>Output:</h3>
                <textarea 
                    className="w100 pl20 pr20"
                    style={{height:"150px"}} 
                    value={logs} 
                    disabled
                />
            </div>
        </div>
    )
}
