import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./alertButton.css";

async function swalDeleteAlbum(
  updateAlbum,
  discardTouristSpot,
  handleClickBack
) {
  const MySwal = withReactContent(Swal);

  const result = await MySwal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
    customClass: {
      confirmButton: "confirmbutton",
      cancelButton: "cancelbutton",
    },
  });
  if (result.isConfirmed) {
    updateAlbum();
    discardTouristSpot();

    MySwal.fire({
      title: "Deleted!",
      text: "Your album has been deleted.",
      icon: "success",
      customClass: {
        confirmButton: "confirmbutton",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleClickBack();
      }
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    MySwal.fire({
      title: "Cancelled",
      text: "Your album is safe :)",
      icon: "error",
      customClass: {
        confirmButton: "confirmbutton",
      },
    });
  }
}

async function swalRemoveFriend(removeFriend) {
  const MySwal = withReactContent(Swal);

  const result = await MySwal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
    customClass: {
      confirmButton: "confirmbutton",
      cancelButton: "cancelbutton",
    },
  });
  if (result.isConfirmed) {
    removeFriend();

    MySwal.fire({
      title: "Remove!",
      text: "The Friend has been removed.",
      icon: "success",
      customClass: {
        confirmButton: "confirmbutton",
      },
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    MySwal.fire({
      title: "Cancelled",
      icon: "error",
      customClass: {
        confirmButton: "confirmbutton",
      },
    });
  }
}

async function swalLogout(logoutImg, toHome) {
  const MySwal = withReactContent(Swal);
  await MySwal.fire({
    title: "Logged Out !",
    text: "The most beautiful thing in the world is, of course, the world itself.",
    imageUrl: logoutImg,
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "logged out",
    customClass: {
      confirmButton: "confirmbutton",
    },
  });
  toHome();
}

function swalDiscardAlbumInEditQuestion(MySwal) {
  return MySwal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
    customClass: {
      confirmButton: "confirmbutton",
      cancelButton: "cancelbutton",
    },
  });
}

function swalDiscardAlbumInEditConfirm(MySwal) {
  return MySwal.fire({
    title: "Deleted!",
    text: "Your album has been deleted.",
    icon: "success",
    customClass: {
      confirmButton: "confirmbutton",
    },
  });
}

function swalDiscardAlbumInEditCancel(MySwal) {
  return MySwal.fire({
    title: "Cancelled",
    text: "Your album is safe :)",
    icon: "error",
    customClass: {
      confirmButton: "confirmbutton",
    },
  });
}

export {
  swalDeleteAlbum,
  swalRemoveFriend,
  swalLogout,
  swalDiscardAlbumInEditQuestion,
  swalDiscardAlbumInEditConfirm,
  swalDiscardAlbumInEditCancel,
};
