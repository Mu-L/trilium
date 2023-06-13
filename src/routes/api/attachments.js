const becca = require("../../becca/becca");
const blobService = require("../../services/blob.js");
const ValidationError = require("../../errors/validation_error");

function getAttachmentBlob(req) {
    const preview = req.query.preview === 'true';

    return blobService.getBlobPojo('attachments', req.params.attachmentId, { preview });
}

function getAttachments(req) {
    const note = becca.getNoteOrThrow(req.params.noteId);

    return note.getAttachments({includeContentLength: true});
}

function getAttachment(req) {
    const {attachmentId} = req.params;

    return becca.getAttachmentOrThrow(attachmentId, {includeContentLength: true});
}

function getAllAttachments(req) {
    const {attachmentId} = req.params;
    // one particular attachment is requested, but return all note's attachments

    const attachment = becca.getAttachmentOrThrow(attachmentId);
    return attachment.getNote()?.getAttachments({includeContentLength: true}) || [];
}

function saveAttachment(req) {
    const {noteId} = req.params;
    const {attachmentId, role, mime, title, content} = req.body;

    const note = becca.getNoteOrThrow(noteId);
    note.saveAttachment({attachmentId, role, mime, title, content});
}

function uploadAttachment(req) {
    const {noteId} = req.params;
    const {file} = req;

    const note = becca.getNoteOrThrow(noteId);

    note.saveAttachment({
        role: 'file',
        mime: file.mimetype,
        title: file.originalname,
        content: file.buffer
    });

    return {
        uploaded: true
    };
}

function renameAttachment(req) {
    const {title} = req.body;
    const {attachmentId} = req.params;

    const attachment = becca.getAttachmentOrThrow(attachmentId);

    if (!title?.trim()) {
        throw new ValidationError("Title must not be empty");
    }

    attachment.title = title;
    attachment.save();
}

function deleteAttachment(req) {
    const {attachmentId} = req.params;

    const attachment = becca.getAttachment(attachmentId);

    if (attachment) {
        attachment.markAsDeleted();
    }
}

function convertAttachmentToNote(req) {
    const {attachmentId} = req.params;

    const attachment = becca.getAttachmentOrThrow(attachmentId);
    return attachment.convertToNote();
}

module.exports = {
    getAttachmentBlob,
    getAttachments,
    getAttachment,
    getAllAttachments,
    saveAttachment,
    uploadAttachment,
    renameAttachment,
    deleteAttachment,
    convertAttachmentToNote
};