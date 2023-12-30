import { useState, useMemo, useEffect } from "react";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import MenuIcon from "@mui/icons-material/Menu";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Box, Typography, Checkbox, IconButton, Button } from "@mui/material";

function Menu({ defaultmenu, user }) {
  //get unique menu from menu Table
  const uniqueMenus = useMemo(
    () => [...new Set(defaultmenu.map((item) => item.menu))],
    [defaultmenu]
  );

  //map submenus to it's menu
  const uniqueSubmenusMap = defaultmenu.reduce((map, item) => {
    const submenus = map.get(item.menu) || new Set();
    submenus.add(item.small_menu);
    map.set(item.menu, submenus);
    return map;
  }, new Map());

  //set initial data
  const initialMenus = {};
  const initialSubmenus = {};
  const initialMicromenus = {};
  uniqueMenus.forEach((menu) => {
    initialMenus[menu] = false;
    [...uniqueSubmenusMap.get(menu)].forEach((submenu) => {
      initialSubmenus[`${menu}#|%${submenu}`] = false;
      defaultmenu
        .filter((item) => item.menu === menu && item.small_menu === submenu)
        .forEach((micromenu) => {
          initialMicromenus[
            `${menu}#|%${submenu}#|%${micromenu.micro_menu}`
          ] = false;
        });
    });
  });

  //for checkbox checked value
  const [checkedMenus, setCheckedMenus] = useState(initialMenus);
  const [checkedSubmenus, setCheckedSubmenus] = useState(initialSubmenus);
  const [checkedMicromenus, setCheckedMicromenus] = useState(initialMicromenus);

  //for checkbox Interminate Value
  const [indeterminateMenus, setIndeterminateMenus] = useState(initialMenus);
  const [indeterminateSubmenus, setIndeterminateSubmenus] =
    useState(initialSubmenus);

  //for Menu and MenuItem View
  const initialSelectMenu = {};
  uniqueMenus.forEach((menu) => {
    initialSelectMenu[menu] = false;
  });

  const initialSelectSubMenu = {};
  uniqueMenus.forEach((menu) => {
    [...uniqueSubmenusMap.get(menu)].map((submenu, subIndex) => {
      initialSelectSubMenu[`${menu}#|%${submenu}`] = false;
    });
  });
  const [selectMenu, setselectMenu] = useState(initialSelectMenu);
  const [selectSubmenu, setselectSubmenu] = useState(initialSelectSubMenu);

  //handle CheckBox checked or unchecked
  const handleCheckboxChange = (event, type, name) => {
    const { checked } = event.target;

    switch (type) {
      case "menu":
        //menu checked
        setCheckedMenus((pre) => ({ ...pre, [name]: checked }));
        setIndeterminateMenus((pre) => ({ ...pre, [name]: false }));

        //menu->small_menu interminate close
        setIndeterminateSubmenus((prevSubmenus) => {
          const updatedSubmenus = { ...prevSubmenus };
          Object.keys(updatedSubmenus).forEach((submenu) => {
            if (submenu.startsWith(`${name}#|%`)) {
              updatedSubmenus[submenu] = false;
            }
          });
          return updatedSubmenus;
        });

        //menu->small_menu checked
        setCheckedSubmenus((prevSubmenus) => {
          const updatedSubmenus = { ...prevSubmenus };
          Object.keys(updatedSubmenus).forEach((submenu) => {
            if (submenu.startsWith(`${name}#|%`)) {
              updatedSubmenus[submenu] = checked;
            }
          });
          return updatedSubmenus;
        });

        //menu -> micro_menu checked
        setCheckedMicromenus((prevMicromenus) => {
          const updatedMicromenus = { ...prevMicromenus };
          Object.keys(updatedMicromenus).forEach((micromenu) => {
            if (micromenu.startsWith(`${name}#|%`)) {
              updatedMicromenus[micromenu] = checked;
            }
          });
          return updatedMicromenus;
        });
        break;

      case "small_menu":
        //small_menu checked
        setCheckedSubmenus((prevSubmenus) => {
          const updatedSubmenus = { ...prevSubmenus, [name]: checked };
          const [menu, small_menu] = name.split("#|%");

          //submenu -> menu Checked if all submenu Checked
          const isAllSubmenusChecked = [...uniqueSubmenusMap.get(menu)].every(
            (submenu) => updatedSubmenus[`${menu}#|%${submenu}`]
          );
          setCheckedMenus((prevMenus) => ({
            ...prevMenus,
            [menu]: isAllSubmenusChecked,
          }));

          //submenu -> menu interminate if some submenu checked
          const isSomeSubmenusChecked = [...uniqueSubmenusMap.get(menu)].some(
            (submenu) =>
              updatedSubmenus[`${menu}#|%${submenu}`] && !isAllSubmenusChecked
          );

          setIndeterminateMenus((pre) => {
            const updateState = { ...pre, [menu]: isSomeSubmenusChecked };
            return updateState;
          });

          return updatedSubmenus;
        });
        setIndeterminateSubmenus((pre) => ({ ...pre, [name]: false }));

        //small_menu -> micro_menu
        setCheckedMicromenus((prevMicromenus) => {
          const updatedMicromenus = { ...prevMicromenus };
          Object.keys(updatedMicromenus).forEach((micromenu) => {
            if (micromenu.startsWith(`${name}#|%`)) {
              updatedMicromenus[micromenu] = checked;
            }
          });
          return updatedMicromenus;
        });
        break;

      case "micro_menu":
        //micromenu checked
        setCheckedMicromenus((prevMicromenus) => {
          const updatedMicromenus = { ...prevMicromenus, [name]: checked };
          const [parentMenu, parentSubmenu, micromenu] = name.split("#|%");

          //micromenu -> submenu checked if all micromenu checked
          const isAllMicromenusChecked = defaultmenu
            .filter(
              (item) =>
                item.menu === parentMenu && item.small_menu === parentSubmenu
            )
            .every(
              (item) =>
                updatedMicromenus[
                  `${item.menu}#|%${item.small_menu}#|%${item.micro_menu}`
                ]
            );
          setCheckedSubmenus((prevSubmenus) => {
            const updatedSubmenus = {
              ...prevSubmenus,
              [`${parentMenu}#|%${parentSubmenu}`]: isAllMicromenusChecked,
            };

            //submenu->menu
            const isAllSubmenusChecked = [
              ...uniqueSubmenusMap.get(parentMenu),
            ].every((submenu) => updatedSubmenus[`${parentMenu}#|%${submenu}`]);

            setCheckedMenus((prevMenus) => ({
              ...prevMenus,
              [parentMenu]: isAllSubmenusChecked,
            }));

            //this is for micro checked -> submenu Interminate -> menu interminate
            const isSomeMicromenusChecked = defaultmenu
              .filter(
                (item) =>
                  item.menu === parentMenu && item.small_menu === parentSubmenu
              )
              .some(
                (item) =>
                  updatedMicromenus[
                    `${item.menu}#|%${item.small_menu}#|%${item.micro_menu}`
                  ] && !isAllMicromenusChecked
              );

            const isSomeSubmenusChecked = [
              ...uniqueSubmenusMap.get(parentMenu),
            ].some(
              (submenu) =>
                updatedSubmenus[`${parentMenu}#|%${submenu}`] &&
                !isAllSubmenusChecked
            );

            setIndeterminateMenus((pre) => ({
              ...pre,
              [parentMenu]: isSomeSubmenusChecked || isSomeMicromenusChecked,
            }));

            return updatedSubmenus;
          });

          //micro -> sub interminate if some micro menu checked
          const isSomeMicromenusChecked = defaultmenu
            .filter(
              (item) =>
                item.menu === parentMenu && item.small_menu === parentSubmenu
            )
            .some(
              (item) =>
                updatedMicromenus[
                  `${item.menu}#|%${item.small_menu}#|%${item.micro_menu}`
                ] && !isAllMicromenusChecked
            );
          setIndeterminateSubmenus((prevSubmenus) => {
            const updatedSubmenus = {
              ...prevSubmenus,
              [`${parentMenu}#|%${parentSubmenu}`]: isSomeMicromenusChecked,
            };
            return updatedSubmenus;
          });

          return updatedMicromenus;
        });

        break;
      default:
        break;
    }
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
          {uniqueMenus.map((menu, index) => (
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
                    setselectMenu((pre) => ({ ...pre, [menu]: !pre[menu] }));
                  }}
                  sx={{
                    transform: `rotate(${
                      !selectMenu[menu] ? "0deg" : "90deg"
                    })`,
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Checkbox
                  checked={checkedMenus[menu] || false}
                  indeterminate={indeterminateMenus[menu]}
                  onChange={(e) => {
                    handleCheckboxChange(e, "menu", menu);
                  }}
                  name={menu}
                />
                <Typography variant={"h5"}>{menu}</Typography>
              </Box>
              {selectMenu[menu] && (
                <>
                  {[...uniqueSubmenusMap.get(menu)].map((submenu, subIndex) => (
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
                              [`${menu}#|%${submenu}`]:
                                !pre[`${menu}#|%${submenu}`],
                            }));
                          }}
                          sx={{
                            transform: `rotate(${
                              !selectSubmenu[`${menu}#|%${submenu}`]
                                ? "0deg"
                                : "90deg"
                            })`,
                          }}
                        >
                          <DragHandleIcon />
                        </IconButton>
                        <Checkbox
                          indeterminate={
                            indeterminateSubmenus[`${menu}#|%${submenu}`] ||
                            false
                          }
                          checked={
                            checkedSubmenus[`${menu}#|%${submenu}`] || false
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "small_menu",
                              `${menu}#|%${submenu}`
                            )
                          }
                          name={`${menu}#|%${submenu}`}
                        />
                        <Typography variant={"h5"}>{submenu}</Typography>
                      </Box>
                      {selectSubmenu[`${menu}#|%${submenu}`] && (
                        <>
                          {defaultmenu
                            .filter(
                              (item) =>
                                item.small_menu === submenu &&
                                item.menu === menu
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
                                      [`${menu.menu}#|%${submenu}`]:
                                        !pre[`${menu.menu}#|%${submenu}`],
                                    }));
                                  }}
                                >
                                  <HorizontalRuleIcon />
                                </IconButton>
                                <Checkbox
                                  checked={
                                    checkedMicromenus[
                                      `${menu.menu}#|%${submenu}#|%${menu.micro_menu}`
                                    ] || false
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "micro_menu",
                                      `${menu.menu}#|%${submenu}#|%${menu.micro_menu}`
                                    )
                                  }
                                  name={`${menu.menu}#|%${submenu}#|%${menu.micro_menu}`}
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
        <Button variant="contained">Update</Button>
        <Button variant="contained">Clear</Button>
      </Box>
    </Box>
  );
}

export default Menu;
