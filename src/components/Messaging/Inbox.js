import React, { useState, useContext } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchInbox from './SearchInbox';
import { MessagingContext } from 'context/MessagingContext';
import { timeAgoFormatDate } from 'common/locale';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  searchInbox: {
    alignSelf: 'flex-end',
  },
  list: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: 0,
  },
  listItem: {
    borderBottom: '1px solid lightGrey',
    '&.Mui-selected': {
      background: theme.palette.primary.lightVery,
      borderLeft: `5px solid ${theme.palette.primary.main}`,
      borderBottom: `1px solid ${theme.palette.primary.main}`,
    },
  },
  listText: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  messageText: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  avatar: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

const Inbox = ({ threads, selectedIndex, handleListItemClick }) => {
  const { paper, searchInbox, list, listItem, listText, avatar } = useStyles();
  const { user } = useContext(MessagingContext);
  const [search, setSearch] = useState('');

  const onClickHelper = (e, i, thread) => {
    let recipient =
      thread.messages[0].subject !== 'Survey' &&
      thread.messages[0].to[0].recipient !== user.userName
        ? thread.messages[0].to[0].recipient
        : thread.messages[0].to[1].type;
    console.log('-----> onClickHelper', user.userName, i, thread);
    handleListItemClick(e, i, recipient);
  };

  return (
    <Paper className={paper}>
      <List className={list}>
        {threads
          .filter((thread) => {
            if (search === '') {
              return thread;
            } else if (
              thread.userName.toLowerCase().includes(search.toLowerCase())
            ) {
              return thread;
            }
          })
          .map((thread, i) => (
            <ListItem
              key={i}
              alignItems="flex-start"
              className={listItem}
              selected={selectedIndex === i}
              onClick={(e) => onClickHelper(e, i, thread)}
            >
              <ListItemAvatar className={avatar}>
                <Avatar alt={''} src={''} />
              </ListItemAvatar>
              {thread.messages[0].subject === 'Survey' ? (
                <ListItemText
                  primary={thread.messages[0].subject}
                  secondary={
                    thread.messages[0].subject
                      ? thread.messages[0].survey.title
                      : thread.userName
                  }
                  className={listText}
                />
              ) : (
                <ListItemText primary={thread.userName} className={listText} />
              )}
              <Typography>
                {timeAgoFormatDate(
                  new Date(
                    thread.messages[thread.messages.length - 1].composed_at
                  )
                )}
              </Typography>
            </ListItem>
          ))}
      </List>
      <SearchInbox className={searchInbox} setSearch={setSearch} />
    </Paper>
  );
};

export default Inbox;
