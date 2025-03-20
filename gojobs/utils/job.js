import { router } from "expo-router";
import { apiUrl } from ".";
// import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { setOffers } from "@/store/slices/appSlice";
import { logout, logoutUser } from "@/store/slices/userSlice";

export const createJob = async (jobData, token, dispatch) => {
  try {
    const formData = new FormData();

    Object.keys(jobData).forEach(key => {
      if (key === 'contractImages' || key === 'selectedPhotos') {
        if (Array.isArray(jobData[key])) {
          jobData[key].forEach((file, index) => {
            if (file.uri && file.name && file.type) {
              // Si l'image est déjà un objet formaté
              formData.append(`${key}[]`, {
                // uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
                name: file.name,
                type: file.type
              });
            } else {
              // Si c'est juste un URI string
              const filename = file.split('/').pop();
              const match = /\.(\w+)$/.exec(filename);
              const type = match ? `image/${match[1]}` : 'image/jpeg';

              formData.append(`${key}[]`, {
                // uri: Platform.OS === 'ios' ? file.replace('file://', '') : file,
                name: filename,
                type
              });
            }
          });
        }
      } else if (key === 'accommodationOptions' || key === 'workingRights') {
        // Handle arrays of strings
        if (Array.isArray(jobData[key])) {
          jobData[key].forEach((value) => {
            formData.append(`${key}[]`, value);
          });
        }
      } else if (typeof jobData[key] === 'object' && !Array.isArray(jobData[key])) {
        formData.append(key, JSON.stringify(jobData[key]));
      } else {
        formData.append(key, jobData[key].toString());
      }
    });

    console.log('FormData images:', [...formData.entries()]
      .filter(entry => entry[0].includes('Images') || entry[0].includes('Photos'))
      .map(entry => ({ key: entry[0], value: entry[1] }))
    );

    const response = await fetch(`${apiUrl}job-offers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    });

    const data = await response.json();
    if (data.code === 200) {
      Toast.show({
        text1: 'Job created successfully',
        type: 'success',
      });
    ListeJob(token, dispatch);
    router.push('/candidat/(tabs)/home');
    } else {
      Toast.show({
        text1: 'Error creating job',
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const ListeJob = async (token, dispatch) => {
  try {
    const response = await fetch(`${apiUrl}job-offers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    if (data.code === 200) {
      dispatch(setOffers(data.data));
    } else {
      if (data.message === "Unauthenticated.") {
        dispatch(logoutUser());
        router.push('/home');
        return null;
      }
    }
  } catch (error) {
    console.error('Error listing jobs:', error);
    throw error;
  }
};

export const getJobById = async (id, token, dispatch) => {
  try {
    const response = await fetch(`${apiUrl}job-offers/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    } else {
      if (data.message === "Unauthenticated.") {
        dispatch(logoutUser());
        router.push('/home');
        return null;
      }
    }
  } catch (error) {
    console.error('Error getting job by id:', error);
    throw error;
  }
};

