var express = require('express');
var router = express.Router();

const { getDiseaseSymptoms, getDiseaseSymptomsModel, getRelatedSymptoms, getUniqueSymptoms } = require('../utills/disease_symptoms')

router.get('/get_disease_symptoms', (req, res) => {
    getDiseaseSymptoms(req, res)
});

router.get('/get_unique_symptoms', (req, res) => {
    getUniqueSymptoms(req, res)
});

router.get('/get_disease_symptoms_model', (req, res) => {
    getDiseaseSymptomsModel(req, res)
});

router.use('/get_related_symptoms', (req, res) => {
    getRelatedSymptoms(req, res)  
})

router.use('/', (req, res) => {
    res.send('<h1>Hello, disease_symptoms.js</h1>')
});

module.exports = router