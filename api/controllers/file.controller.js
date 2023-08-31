const FileModel = require("../models/file.model");
const path = require("path");
const fs = require("fs");

const uploadFile = async (req, res, next) => {
    try {
        console.log(req.body);
        const user = req.body.id;
        const code = req.body.name;

        const file = req.file.path;
        const response = await FileModel.create({ user, code, file });
        res.status(200).json({ response });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const getFiles = async (req, res, next) => {
    const username = req.body.user;
    try {
        const files = await FileModel.find({ user: username });
        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
    }
};

const downloadFile = async (req, res, next) => {
    const { id } = req.params;
    const item = await FileModel.findById(id);
    if (!item) {
        return next(new Error("Item not found"));
    }
    console.log(item);

    const theFile = item.file;
    console.log(theFile);
    const filePath = path.join(__dirname, `../../${theFile}`);
    res.download(filePath);
};

const deleteFile = async (req, res) => {
    const { id } = req.params;
    const item = await FileModel.findById(id);
    if (!item) {
        return next(new Error("Item not found"));
    }
    const fileLocation = path.join(__dirname, `../../${item.file}`);
    fs.unlink(fileLocation, (err) => {
        if (err) {
            return res.status(500).send({
                message: "Could not delete the file. " + err,
            });
        }

        FileModel.findOneAndRemove({ _id: id }).then(() => {
            return res.status(200).send({
                success: true,
                message: "File is deleted.",
            });
        }).catch(error => {
            return res.status(500).send({
                message: error,
            });
        });
    });
};

const getAllFiles = async (req, res) => {
    try {
        const files = await FileModel.find();
        // console.log(files);
        res.status(200).json({ files });
    } catch (error) {
        console.error(error);
        res.send({ message: error });
    }
};

const urlDownload = async (req, res) => {
    const { id, code } = req.params;
    console.log(id, code);
    const item = await FileModel.find({ _id: id, code });
    if (!item) {
        return next(new Error("File not found"));
    }
    console.log(item);
    console.log(item[0].file);

    const thePath = item[0].file;
    console.log("thePath", thePath);
    const file = path.join(__dirname, `../../${thePath}`);
    res.download(file);
};

module.exports = {
    uploadFile,
    getFiles,
    deleteFile,
    getAllFiles,
    urlDownload
};

