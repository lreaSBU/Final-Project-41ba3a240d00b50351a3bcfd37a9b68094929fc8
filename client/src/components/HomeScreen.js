import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {        
        store.loadIdNamePairs();
    }, []);

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let listCard = "";
    if (store) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!RENDERING FOR CURRENTVIEW: " + store.currentView);
        listCard = 
            <List sx={{ width: '100%', left: '0%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        sx={{bgcolor: ((store.currentList && (pair._id == store.currentList._id)) ? 'red' : 'background.paper')}}
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
                {modalJSX}
            </div>
        </div>)
}

export default HomeScreen;