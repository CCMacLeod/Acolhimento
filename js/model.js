var db;
var dataset;

function initDatabase() {
    console.debug('called initDatabase()');

    try {
        if (!window.openDatabase) {
            alert('Banco de Dados não suportado!');
        } else {
            var shortName = 'AcolhimentoDB';
            var version = '1.0';
            var displayName = 'Meu banco de dados do sistema de Acolhimento';
            var maxSizeInBytes = 65536;
            db = openDatabase(shortName, version, displayName, maxSizeInBytes);

            createTableIfNotExists();
        }
    } catch(e) {
        if (e == 2) {
            alert('Versão de Banco de Dados errada!');
        } else {
            alert('Erro desconhecido: ' + e);
        }
        return;
    }
}

function createTableIfNotExists() {
    console.debug('called createTableIfNotExists()');

    /**
     * comandos de criação das tabelas que compoem a criação dos Tipos.
     */
    var sqlGenero = "CREATE TABLE IF NOT EXISTS GeneroBiologico (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, excluido INTEGER)";
    var sqlSexualidade = "CREATE TABLE IF NOT EXISTS Sexualidade (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, excluido INTEGER)";
    var sqlReligiosidade = "CREATE TABLE IF NOT EXISTS Religiosidade (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, excluido INTEGER)";
    var sqlEtnia = "CREATE TABLE IF NOT EXISTS Etnia (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, excluido INTEGER)";
    var sqlEstadoCivil = "CREATE TABLE IF NOT EXISTS EstadoCivil (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, excluido INTEGER)";
    var sqlEscolaridade = "CREATE TABLE IF NOT EXISTS Escolaridade (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, excluido INTEGER)";

    /**
     * comandos de criação das tabelas que compoem a criação do cadastro do acolhido e suas ramificações
     */
    var sqlAcolhido = "CREATE TABLE IF NOT EXISTS Acolhido (id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                "id_genero INTEGER, "+
                "id_sexualidade INTEGER, "+
                "id_religiosidade INTEGER, "+
                "id_etnia INTEGER, "+
                "id_estadoCivil INTEGER, "+
                "id_escolaridade INTEGER, "+
                "nome TEXT, "+
                "telefone TEXT, "+
                "celular TEXT, "+
                "email TEXT, "+
                "excluido INTEGER)";
    var sqlAnamnese = "CREATE TABLE IF NOT EXISTS Anamnese (id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                "id_acolhido INTEGER, "+
                "data_anamnese TEXT, "+
                "queixa_principal TEXT, "+ 
                "habitos TEXT, "+
                "historia_atual TEXT, "+
                "historia_anterior TEXT, "+
                "historia_familiar TEXT, "+
                "excluido INTEGER)";
    var sqlEvolucao = "CREATE TABLE IF NOT EXISTS Evolucao (id INTEGER PRIMARY KEY AUTOINCREMENT, id_acolhido INTEGER, data_evolucao TEXT, evolucao TEXT, excluido INTEGER)";

    /**
     * comandos de criação das tabelas que compoem a criação dos agendamentos.
     */
    var sqlAgendamento = "CREATE TABLE IF NOT EXISTS Agendamento (id INTEGER PRIMARY KEY AUTOINCREMENT, id_acolhido INTEGER, data_agendamento TEXT, hora TEXT, excluido INTEGER)";

    var arraySql = Array();
    //console.log(arraySql);

    arraySql.push(sqlAcolhido, sqlAgendamento, sqlAnamnese, sqlEscolaridade, sqlEstadoCivil, sqlEtnia, sqlEvolucao, sqlGenero, sqlReligiosidade, sqlSexualidade);
    //console.log(arraySql);

    db.transaction(
        function (transaction) {
            for(i=0; i < arraySql.length; i++){
                transaction.executeSql(arraySql[i], [], showRecords, handleErrors);
                console.debug('executeSql: ' + arraySql[i]);
            }
        }
    );
}

function insertRecord(pagina) {
    console.debug('called insertRecord()');

    //var id = $('#id_genero').val();
    var descricao = $('#descricao').val();
    var excluido = $('#excluido').val();

    var sql = 'INSERT INTO '+ pagina +' (descricao, excluido) VALUES (?, ?)';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [descricao, excluido], showRecordsAndResetForm, handleErrors);
            console.debug('executeSql: ' + sql);
        }
    );
}

function deleteRecord(pagina, id) {
    console.debug('called deleteRecord()');

    var sql = 'DELETE FROM '+pagina+' WHERE id=?';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [id], showRecords, handleErrors);
            console.debug('executeSql: ' + sql);
            alert('Registro apagado com sucesso');
        }
    );

    resetForm();
}

function updateRecord(pagina, id) {
    console.debug('called updateRecord()');

    var name = $('#descricao').val();
    var phone = $('#excluido').val();
    var id = $("#"+id+"").val();

    var sql = 'UPDATE '+pagina+' SET descricao=?, excluido=? WHERE id=?';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [id, descricao, excluido], showRecordsAndResetForm, handleErrors);
            console.debug('executeSql: ' + sql);
        }
    );
}

function dropTable() {
    console.debug('called dropTable()');

    var sql = 'DROP TABLE Contacts';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], showRecords, handleErrors);
        }
    );

    resetForm();

    initDatabase();
}

function resetFormConfiguracao() {
    console.debug('called resetForm()');

    $('#descricao').val('');
    $('#excluido').val('');
    $('#id').val('');
}

function showRecordsAndResetFormConfiguracao() {
    console.debug('called showRecordsAndResetForm()');

    resetFormConfiguracao();
    showRecords()
}

function handleErrors(transaction, error) {
    console.debug('called handleErrors()');
    console.error('error ' + error.message);

    alert(error.message);
    return true;
}

function showRecordsConfiguracao(pagina) {
    console.debug('called showRecords()');

    var sql = "SELECT * FROM "+pagina;

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], renderRecordsConfiguracao, handleErrors);
        }
    );
}

function renderRecordsConfiguracao(transaction, results) {
    console.debug('called renderRecords()');

    html = '';
    $('#results').html('');

    dataset = results.rows;

    if (dataset.length > 0) {
        html = html + '  <ul data-role="listview">';

        for (var i = 0, item = null; i < dataset.length; i++) {
            item = dataset.item(i);

            html = html + '    <li>';
            html = html + '      <h3>' + item['descricao'] + '</h3>';
            html = html + '      <p>Phone: ' + item['excluido'] + '</p>';
            html = html + '      <p>Id: ' + item['id'] + '</p>';
            html = html + '      <p>';
            html = html + '        <button type="button" data-icon="arrow-u" onClick="prepareEdit(' + i + ');">edit</button>';
            html = html + '        <button type"button" data-icon="delete" onClick="deleteRecord(' + item['id'] + ');">delete</button>';
            html = html + '      </p>';
            html = html + '    </li>';
        }

        html = html + '  </ul>';

        $('#results').append(html);
        $('#results ul').listview();
    }
}

function prepareAdd() {
    $('form').show();
    $('#btnAdd').addClass('ui-disabled');
    $('#results').addClass('ui-disabled');
    $('#btnSave').on('click', function(){ insertRecord() });
    $('#btnSave').on('click', function(){ cancelAction() });
    $('#name').focus();
}

function prepareEdit(i) {
    loadRecord(i)

    $('form').show();
    $('#btnAdd').addClass('ui-disabled');
    $('#results').addClass('ui-disabled');
    $('#btnSave').on('click', function(){ updateRecord() });
    $('#btnSave').on('click', function(){ cancelAction() });
    $('#name').focus();
}

function loadRecord(i) {
    console.debug('called loadRecord()');

    var item = dataset.item(i);

    $('#name').val(item['name']);
    $('#phone').val(item['phone']);
    $('#id').val(item['id']);
}

function cancelAction() {
    $('form').hide();
    $('#btnAdd').removeClass('ui-disabled');
    $('#results').removeClass('ui-disabled');
    $('#btnSave').off('click');
}

function updateCacheContent(event) {
    console.debug('called updateCacheContent()');
    window.applicationCache.swapCache();
}

$(document).ready(function () {
    //window.applicationCache.addEventListener('updateready', updateCacheContent, false);

    initDatabase();
    cancelAction();
});