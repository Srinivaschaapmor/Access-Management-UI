import React, { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import {
  fetchMasterData,
  getUsers,
  getUsersWithAccess,
} from "../../apiCalls/Apicalls";

function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userAccess, setUserAccess] = useState(0);
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const category = "Orgx";

  const fetchData = async () => {
    try {
      let config = {
        headers: {
          Authorization: Cookies.get("jwtToken"),
          "Content-Type": "application/json",
        },
      };
      const response = await axios.get(`${fetchMasterData}${category}`, config);
      setAccessData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = () => {
    axios
      .get(getUsers)
      .then((response) => {
        setTotalUsers(response.data?.length);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
      });
  };

  const fetchUsersWithAccess = () => {
    axios
      .get(getUsersWithAccess)
      .then((response) => {
        setUserAccess(response.data?.length);
      })
      .catch((error) => {
        console.error("Error fetching users with access data:", error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
    fetchUsersWithAccess();
  }, []);

  const totalAccess = accessData ? accessData?.length : 0;

  const data = [
    {
      label: "Total Users",
      value: totalUsers,
    },
    {
      label: "Users with Access",
      value: userAccess,
    },
    {
      label: "Total Access",
      value: totalAccess,
    },
  ];

  return (
    <Box p={5} pt={3}>
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          borderRadius: 3,
          mt: 2,
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Box my={3}>
            <Typography variant="h6" fontWeight={700}>
              Overview
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={3}>
          {data.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Box
                sx={{
                  px: 3,
                  py: 3,
                  bgcolor: "",
                  borderRadius: 2,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography fontSize={15} color={"grey"}>
                  {item.label}
                </Typography>
                <Typography fontSize={18} mt={1} fontWeight={600}>
                  {item.value ? item.value : "N/A"}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
