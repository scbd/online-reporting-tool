<template>
  <div class="text-center">
    <div class="h1">
      <CIcon name="minusCircle" class="text-danger" size="lg" />
      <span class="ml-2">Forbidden</span>
    </div>
    <div>You are not authorized to access or view this resource</div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',
  auth: false,
};
</script>
