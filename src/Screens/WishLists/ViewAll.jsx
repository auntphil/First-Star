import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../utils/firebase";
import { LoadingThreeCircles } from "../Loading";

const ViewAll = ( props ) => {
    const { user } = props

    const [newList, setNewList] = useState('')
    const [ lists, setLists] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const getLists = async () => {
            const querySnapshot = await getDocs(collection(db, "lists"))
            let lists = []
            querySnapshot.forEach( list => {
                lists.push(list)
            })
            setLists(lists)
            setLoading(false)
        }

        getLists()
    },[])

    const handleNewListUpate = (e) => {
        setNewList(e.target.value)
    }

    const handleCreateList = async () => {
        const ref = await addDoc(collection(db, "lists"),{
            name: newList
        })

        const list = {
            id: ref.id,
            ... newList,
        }

        setNewList('')
        console.log(list)
    }

    return(
        <div id="wrapper">
            <h2>Wish Lists</h2>
            {
                loading ? 
                    <LoadingThreeCircles />
                :
                    <ul>{lists.map( list => (
                        <Link key={list.id} to={`/list?id=${list.id}`}>
                            <li>
                                {list.data().name}
                            </li>
                        </Link>
                    ))}</ul>
            }
            <input type="text" onChange={handleNewListUpate} value={newList} placeholder="Birthday!" />
            <button onClick={handleCreateList}>Create New Wish List</button>
        </div>
    )

}

export default ViewAll