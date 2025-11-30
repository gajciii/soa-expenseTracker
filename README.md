### 📦 Mikroservisi – delo s submoduli

Ta repozitorij uporablja Git submodule, kjer je vsaka mikrostoritev ločen repo.
Spodaj so navodila za kloniranje, posodabljanje in dodajanje submodulov.
<br/>
<br/>

### ⚠️ Pomembno – submoduli morajo biti PUBLIC

Da kloniranje deluje brez težav, morajo biti vsi submoduli nastavljeni na public.
Private submoduli povzročijo napake pri kloniranju in inicializaciji.
<br/>
<br/>

### 🚀 Kloniranje repozitorija z vsemi mikrostoritvami

1. Kloniraš glavni repo:
    ```bash
    git clone https://github.com/gajciii/soa-expenseTracker.git
    cd soa-expenseTracker
    ```
2. Potegneš vse submodule:
   ```bash
   git submodule update --init --recursive
   ```
3. Če želiš posodobiti vse submodule na najnovejši commit:
   ```bash
   git submodule foreach git pull
   ```
   ali:
   ```bash
   git submodule foreach git pull origin main   # če vsi delajo na main
   ```

### ➕ Dodajanje nove mikrostoritve (submodula)
1. Dodaš submodule:
   ```bash
   git submodule add <URL> <pot/do/modula>
   ```
   Primer:
   ```bash
   git submodule add git@github.com:mojorg/user-service.git services/user-service
    ```
2. Potrdiš spremembe:
   ```bash
   git commit -m "Dodana nova mikrostoritev: user-service"
   git push
    ```
