import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import SongCard from './SongCard.js'
import LikeIcon from '@mui/icons-material/ThumbUp';
import DislikeIcon from '@mui/icons-material/ThumbDown';
import LikeIconOff from '@mui/icons-material/ThumbUpOffAlt';
import DislikeIconOff from '@mui/icons-material/ThumbDownOffAlt';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleLike(e){
        store.changeLikes(idNamePair._id, true);
    }
    function handleDislike(e){
        store.changeLikes(idNamePair._id, false); //Need to write in this function!!!
    }
    
    function handleDup(e){
        console.log("vndjwbvwji");
    }

    function handlePub(e){
        console.log("PUBLISH");
    }

    function handleToggleEdit(event) {    
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let ldl = '';
    if(store.currentView > 1){
        ldl = <div>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleLike} aria-label='like'>
                    <Box sx={{ p: 1, flexGrow: 1, color: 'black' }}>{idNamePair.likes}</Box>
                    <LikeIcon style={{fontSize:'32pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleDislike} aria-label='dislike'>
                    <Box sx={{ p: 1, flexGrow: 1, color: 'black' }}>{idNamePair.dislikes}</Box>
                    <DislikeIcon style={{fontSize:'32pt'}} />
                </IconButton>
            </Box>
        </div>
    }else{
        ldl = <div>
            <Box>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'32pt'}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={(event) => {handleDeleteList(event, idNamePair._id)}} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'32pt'}} />
                </IconButton>
            </Box>
            <Box>
                <Button sx={{bgcolor: '#e6e6e6', fontSize: '16px', textAlign: "center"}} onClick={handlePub}>Publish</Button>
            </Box>
        </div>
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '48pt' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            {ldl}
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    let cardBod = '';
    if(store.currentList && store.currentList._id == idNamePair._id){
        cardBod =
        <div>
            <List 
                id="playlist-cards" 
                sx={{ width: '100%', bgcolor: '#669966' }}
            >
                {
                    store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))  
                }
            </List>
            <Box sx={{bgcolor: '#669966', fontSize: '32px', textAlign: "center"}}>⋮</Box>
            <Button sx={{bgcolor: '#e6e6e6', fontSize: '16px', textAlign: "center"}} onClick={handleDup}>Duplicate</Button>
        </div>
    }
    return (
        <div>
            {cardElement}
            {cardBod}
        </div>
    );
}

export default ListCard;