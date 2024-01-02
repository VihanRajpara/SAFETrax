import { useState, useMemo, useEffect } from "react";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import MenuIcon from "@mui/icons-material/Menu";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Box, Typography, Checkbox, IconButton, Button, useTheme } from "@mui/material";
import { useSnackbar } from "../../snackbar/SnackbarContext";
import { tokens } from "../../theme";
import axios from "axios";
import { Tune } from "@mui/icons-material";
function Menu(props) {
  const { showSnackbar } = useSnackbar();
  const [selectedcheckbox, setSelectedcheckbox] = useState([]);
  const [defaultmenu, setDefaultmenu] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const uniqueMenus = useMemo(() => {
    const uniqueObjects = {};
    defaultmenu.forEach((item) => {
      const key = item.menu_id;
      uniqueObjects[key] = { menu: item.menu, menu_id: item.menu_id };
    });
    return Object.values(uniqueObjects);
  }, [defaultmenu]);

  // console.log("........................", uniqueenus)

  // map submenus to it's menu
  const uniqueSubmenusMap = useMemo(() => {
    return defaultmenu.reduce((map, item) => {
      const submenus = map.get(item.menu_id) || [];
      const existingSubmenu = submenus.find((submenu) => submenu.small_menu_id === item.small_menu_id);
      if (!existingSubmenu) {
        submenus.push({ small_menu: item.small_menu, small_menu_id: item.small_menu_id });
      }
      map.set(item.menu_id, submenus);
      return map;
    }, new Map());
  }, [defaultmenu]);



  useEffect(() => { setSelectedcheckbox(props.selectedcheckbox) }, [props.selectedcheckbox])

  //set initial data
  useEffect(() => {
    try {
      axios
        .get(`http://localhost:8080/user/all`)
        .then((response) => {
          setDefaultmenu(() => {
            const menu = response.data;
            return menu;
          });
        });
    } catch (e) { console.log(e); }
  }, [])

  useEffect(() => {
    DataReset();
  }, [defaultmenu, selectedcheckbox])



  //for checkbox checked value
  const [checkedMenus, setCheckedMenus] = useState({});
  const [checkedSubmenus, setCheckedSubmenus] = useState({});
  const [checkedMicromenus, setCheckedMicromenus] = useState({});

  //for checkbox Interminate Value
  const [indeterminateMenus, setIndeterminateMenus] = useState({});
  const [indeterminateSubmenus, setIndeterminateSubmenus] = useState({});

  const [selectMenu, setselectMenu] = useState({});
  const [selectSubmenu, setselectSubmenu] = useState({});

  //menu -> submenu
  const MenutoSubmenu = (checked, name) => {
    //for that menu checked
    setCheckedMenus((pre) => ({ ...pre, [name]: checked }));
    //for interminate false
    setIndeterminateMenus((pre) => ({ ...pre, [name]: false }));
    [...uniqueSubmenusMap.get(name)].forEach(
      (submenu) => {
        SubmenuToMicromenu(checked, `${name}#|%${submenu.small_menu_id}`, "menu->small_menu")
      }
    );
  }

  //submenu -> micromenu
  const SubmenuToMicromenu = (checked, name, type) => {
    const [menu_id, small_menu_id] = name.split("#|%");

    setCheckedSubmenus((prevSubmenus) => {
      const updatedSubmenus = { ...prevSubmenus, [name]: checked };
      if (type === "onlysmall_menu") {
        Small_menutoMenu(updatedSubmenus, menu_id);
      }
      return updatedSubmenus;
    });
    setIndeterminateSubmenus((pre) => ({ ...pre, [name]: false }));
    defaultmenu
      .filter(
        (item) =>
          item.menu_id === menu_id && item.small_menu_id === small_menu_id
      )
      .forEach(
        (item) => { setCheckedMicromenus((pre) => ({ ...pre, [`${item.menu_id}#|%${item.small_menu_id}#|%${item.micro_menu_id}`]: checked })); }
      );
  }

  const isAllSubmenusChecked = (updatedstate, menu_id) => {
    const ans = [
      ...uniqueSubmenusMap.get(menu_id),
    ].every((submenu) => updatedstate[`${menu_id}#|%${submenu.small_menu_id}`]);
    return ans;
  }

  const isSomeSubmenusChecked = (updatedstate, menu_id) => {
    const ans = [
      ...uniqueSubmenusMap.get(menu_id),
    ].some((submenu) => updatedstate[`${menu_id}#|%${submenu.small_menu_id}`] && !isAllSubmenusChecked(updatedstate, menu_id));
    return ans;
  }


  //micromenu -> submenu 
  const MicromenutoSmall_menu = (checked, name) => {
    const [menu_id, small_menu_id, micro_menu_id] = name.split("#|%");
    setCheckedMicromenus((prevMicromenus) => {
      console.log("micromenu :-", name, checked);
      const updatedMicromenus = { ...prevMicromenus, [name]: checked };
      setCheckedSubmenus((pre) => {
        const updateState = { ...pre, [`${menu_id}#|%${small_menu_id}`]: isAllMicromenusChecked(updatedMicromenus, menu_id, small_menu_id) };
        console.log("update state", isAllMicromenusChecked(updatedMicromenus, menu_id, small_menu_id))
        Small_menutoMenu(updateState, menu_id);
        return updateState;
      });
      setIndeterminateSubmenus((pre) => {
        const updateState = { ...pre, [`${menu_id}#|%${small_menu_id}`]: isSomeMicromenusChecked(updatedMicromenus, menu_id, small_menu_id) };
        console.log("update state inter ", isSomeMicromenusChecked(updatedMicromenus, menu_id, small_menu_id))
        const isSomeSubmenusCheckeded = [...uniqueSubmenusMap.get(menu_id)].some((item) =>
          updateState[`${menu_id}#|%${item.small_menu_id}`]
        )
        setIndeterminateMenus((pre) => ({ ...pre, [menu_id]: isSomeSubmenusCheckeded }));
        return updateState;
      });
      return updatedMicromenus;
    });
  };

  const isAllMicromenusChecked = (updatedstate, menu_id, small_menu_id) => {
    const ans = defaultmenu
      .filter(
        (item) =>
          item.menu_id === menu_id && item.small_menu_id === small_menu_id
      )
      .every(
        (item) =>
          updatedstate[
          `${item.menu_id}#|%${item.small_menu_id}#|%${item.micro_menu_id}`]

      );
    return ans;
  }

  const isSomeMicromenusChecked = (updatedstate, menu_id, small_menu_id) => {
    const ans = defaultmenu
      .filter(
        (item) =>
          item.menu_id === menu_id && item.small_menu_id === small_menu_id
      )
      .some(
        (item) =>
          updatedstate[
          `${item.menu_id}#|%${item.small_menu_id}#|%${item.micro_menu_id}`
          ] && !isAllMicromenusChecked(updatedstate, menu_id, small_menu_id)
      );
    return ans;

  }
  //submenu -> menu
  const Small_menutoMenu = (updatedSubmenus, menu_id) => {
    setCheckedMenus((pre) => {
      const updateState = { ...pre, [menu_id]: isAllSubmenusChecked(updatedSubmenus, menu_id) };
      return updateState;
    });
    setIndeterminateMenus((pre) => {
      const updateState = { ...pre, [menu_id]: isSomeSubmenusChecked(updatedSubmenus, menu_id) };
      return updateState;
    });
  }

  //handle CheckBox checked or unchecked
  const handleCheckboxChange = (event, type, name) => {
    if (props.user !== null) {
      const { checked } = event.target;
      switch (type) {
        case "menu":
          // Menuallcase(checked, name);
          MenutoSubmenu(checked, name)
          break;

        case "small_menu":
          SubmenuToMicromenu(checked, name, "onlysmall_menu");
          // Small_menuallcase(checked, name);
          break;

        case "micro_menu":
          MicromenutoSmall_menu(checked, name)

          break;
        default:

          break;
      }
    } else {
      showSnackbar("Please select a user first !", "error");
    }

  };
  // const [newMenu, setNewMenu] = useState([]);

  const handleUpdate = async () => {
    if (props.user !== null && props.click===true) {
      const itemsToAdd = [];

      uniqueMenus.forEach((i) => {
        [...uniqueSubmenusMap.get(i.menu_id)].forEach((submenu) => {
          defaultmenu
            .filter((item) => item.menu_id === i.menu_id && item.small_menu_id === submenu.small_menu_id)
            .forEach((item) => {
              const key = `${item.menu_id}#|%${item.small_menu_id}#|%${item.micro_menu_id}`;
              if (checkedMicromenus[key]) {
                itemsToAdd.push(item);
              }
            });
        });
      });
      console.log(itemsToAdd);

      try {
        await axios
          .post(`http://localhost:8080/user/update/${props.user.mecode}`,

            itemsToAdd,
          )
          .then((response) => {
            // setSelectedcheckbox(response.data);
            if (response.status === 200) {
              props.handleGo();
              showSnackbar("Data Upfdated !", "success");
              console.log("selected menus", response.data);
              props.handleClick("update");
            } else {
              showSnackbar("Please Try again!", "error");
              console.log("selected menus", response.status);
            }

          });
      } catch (e) { console.log(e); }

    } else {
      showSnackbar("Please select a user first!", "error");
    }
  };


  const DataReset = async () => {
    // innitialData();
    const newCheckedMenus = {};
    const newCheckedSubmenus = {};
    const newCheckedMicromenus = {};
    const newinterMenus = {};
    const newinterSubmenus = {};
    uniqueMenus.forEach((menu) => {
      const menuKey = menu.menu_id;

      // Reset checked state for menus
      newCheckedMenus[menuKey] = false;

      // Reset checked state for submenus
      [...uniqueSubmenusMap.get(menuKey)].forEach((submenu) => {
        const submenuKey = `${menuKey}#|%${submenu.small_menu_id}`;
        newCheckedSubmenus[submenuKey] = false;
        // Reset checked state for micromenus
        defaultmenu
          .filter((micromenu) => micromenu.menu_id === menuKey && micromenu.small_menu_id === submenu.small_menu_id)
          .forEach((micromenu) => {
            const micromenuKey = `${menuKey}#|%${submenu.small_menu_id}#|%${micromenu.micro_menu_id}`;
            newCheckedMicromenus[micromenuKey] = false;
            // Check if micromenu is selected and update the state
            selectedcheckbox.some((selectedItem) =>
              selectedItem.menu_id === micromenu.menu_id &&
              selectedItem.small_menu_id === micromenu.small_menu_id &&
              selectedItem.micro_menu_id === micromenu.micro_menu_id
            ) && (newCheckedMicromenus[micromenuKey] = true);

          });

        // Check if any micromenu is checked and update the state
        if (Object.keys(newCheckedMicromenus).some((micromenuKey) =>
          micromenuKey.startsWith(submenuKey) && newCheckedMicromenus[micromenuKey]
        )) {
          newinterSubmenus[submenuKey] = true;
        }

        // Check if all micromenus are checked and update the state for checked
        const submenuMicromenus = Object.keys(newCheckedMicromenus).filter((micromenuKey) =>
          micromenuKey.startsWith(submenuKey)
        );
        if (submenuMicromenus.length > 0 &&
          submenuMicromenus.every((micromenuKey) => newCheckedMicromenus[micromenuKey])
        ) {
          newinterSubmenus[submenuKey] = false;
          newCheckedSubmenus[submenuKey] = true;
        }

      });


      if (Object.keys(newCheckedSubmenus).some((submenuKey) =>
        submenuKey.startsWith(menuKey) && newCheckedSubmenus[submenuKey]
      )) {
        newinterMenus[menuKey] = true;
      } else if (Object.keys(newCheckedSubmenus).some((submenuKey) =>
        submenuKey.startsWith(menuKey) && newinterSubmenus[submenuKey]
      )) {
        newinterMenus[menuKey] = true;
      }

      const menuSubmenus = Object.keys(newCheckedSubmenus).filter((submenuKey) =>
        submenuKey.startsWith(menuKey)
      );
      if (menuSubmenus.length > 0 &&
        menuSubmenus.every((submenuKey) => newCheckedSubmenus[submenuKey])
      ) {
        newinterMenus[menuKey] = false;
        newCheckedMenus[menuKey] = true;
      }
    });

    setCheckedMenus(newCheckedMenus);
    setCheckedSubmenus(newCheckedSubmenus);
    setCheckedMicromenus(newCheckedMicromenus);
    setIndeterminateMenus(newinterMenus);
    setIndeterminateSubmenus(newinterSubmenus);
    setselectMenu({});
    setselectSubmenu({});
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box display="flex" justifyContent="center">
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignSelf="flex-start"
          sx={{ marginLeft: -20 }}
        >
          {uniqueMenus.map((item, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              flexDirection="column"
              alignSelf="flex-start"
            >
              <Box display="flex" alignItems="center" alignSelf="flex-start">
                <IconButton
                  onClick={() => {
                    setselectMenu((pre) => ({ ...pre, [item.menu_id]: !pre[item.menu_id] }));
                  }}
                  sx={{
                    transform: `rotate(${!selectMenu[item.menu_id] ? "0deg" : "90deg"
                      })`,
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Checkbox
                  checked={checkedMenus[item.menu_id] || false}
                  indeterminate={indeterminateMenus[item.menu_id]}
                  onChange={(e) => {
                    handleCheckboxChange(e, "menu", item.menu_id);
                  }}
                  name={item.menu_id}
                />
                <Typography variant={"h5"}>{item.menu}</Typography>
              </Box>
              {selectMenu[item.menu_id] && (
                <>
                  {[...uniqueSubmenusMap.get(item.menu_id)].map((submenu, subIndex) => (
                    <Box
                      key={subIndex}
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                      alignSelf="flex-start"
                      sx={{ marginLeft: 4 }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        alignSelf="flex-start"
                      >
                        <IconButton
                          onClick={() => {
                            setselectSubmenu((pre) => ({
                              ...pre,
                              [`${item.menu_id}#|%${submenu.small_menu_id}`]:
                                !pre[`${item.menu_id}#|%${submenu.small_menu_id}`],
                            }));
                          }}
                          sx={{
                            transform: `rotate(${!selectSubmenu[`${item.menu_id}#|%${submenu.small_menu_id}`]
                              ? "0deg"
                              : "90deg"
                              })`,
                          }}
                        >
                          <DragHandleIcon />
                        </IconButton>
                        <Checkbox
                          indeterminate={
                            indeterminateSubmenus[`${item.menu_id}#|%${submenu.small_menu_id}`] || false
                          }
                          checked={
                            checkedSubmenus[`${item.menu_id}#|%${submenu.small_menu_id}`] || false
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "small_menu",
                              `${item.menu_id}#|%${submenu.small_menu_id}`
                            )
                          }
                          name={`${item.menu_id}#|%${submenu.small_menu_id}`}
                        />
                        <Typography variant={"h5"}>{submenu.small_menu}</Typography>
                      </Box>
                      {selectSubmenu[`${item.menu_id}#|%${submenu.small_menu_id}`] && (
                        <>
                          {defaultmenu
                            .filter(
                              (ite) =>
                                ite.small_menu_id === submenu.small_menu_id &&
                                ite.menu_id === item.menu_id
                            )
                            .map((menu, index) => (
                              <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                alignSelf="flex-start"
                                sx={{ marginLeft: 3 }}
                              >
                                <IconButton
                                  onClick={() => {
                                    setselectSubmenu((pre) => ({
                                      ...pre,
                                      [`${menu.menu_id}#|%${menu.small_menu_id}`]:
                                        !pre[`${menu.menu_id}#|%${menu.small_menu_id}`],
                                    }));
                                  }}
                                >
                                  <HorizontalRuleIcon />
                                </IconButton>
                                <Checkbox
                                  checked={
                                    checkedMicromenus[
                                    `${menu.menu_id}#|%${menu.small_menu_id}#|%${menu.micro_menu_id}`
                                    ] || false
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "micro_menu",
                                      `${menu.menu_id}#|%${menu.small_menu_id}#|%${menu.micro_menu_id}`
                                    )
                                  }
                                  name={`${menu.menu_id}#|%${menu.small_menu_id}#|%${menu.micro_menu_id}`}
                                />
                                <Typography variant={"h5"}>
                                  {menu.micro_menu}
                                </Typography>
                              </Box>
                            ))}
                        </>
                      )}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{ margin: 3, marginBottom: 5, gap: 2 }}
        display="flex"
        justifyContent="center"
      >
        <Button variant="contained" sx={{ bgcolor: `${colors.blueAccent[600]}` }} onClick={() => handleUpdate()}>Update</Button>
        <Button variant="contained" sx={{ bgcolor: `${colors.blueAccent[600]}` }} onClick={() => DataReset()}>Clear</Button>
      </Box>
    </Box>
  );
}

export default Menu;
